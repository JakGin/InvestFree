import json

from django.contrib.auth import login, logout
from django.db import transaction as db_transaction, IntegrityError
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .serializers import UserRegisterSerializer, UserLoginSerializer
from .models import *
from .validations import validate_register_data
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

from .user import get_user_stocks
from .validations import username_valid, email_valid, password_valid
from .utils import GlobalState


class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        data = request.data
        try:
            validate_register_data(data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserRegisterSerializer(data=data)
        if serializer.is_valid(raise_exception=False):
            user = serializer.create(data)
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(
            {"error": "User with this username or email already exists"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        data = request.data
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(data)
            if user is not None:
                login(request, user)
                return Response(serializer.data, status.HTTP_200_OK)
            return Response(
                {"error": "Invalid username and/or password"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class UserLogout(APIView):
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)


@login_required
@require_http_methods(["GET"])
def get_user(request):
    """
    Get user data including his wallet and stocks.
    """
    user = request.user
    stocks_owned_list, money_in_stocks = get_user_stocks(user)

    user_data = {
        "username": user.username,
        "email": user.email,
        "moneyInAccount": user.money_in_account,
        "moneyInStocks": money_in_stocks,
        "stocksOwned": stocks_owned_list,
    }

    return JsonResponse(user_data)


@login_required
@require_http_methods(["GET"])
def get_stocks_data(request):
    """
    Get stock data from the JSON file that is saved on the server.
    This file is fetched from the Polygon API every 24 hours.
    """
    with open("investfree/stock_data.json", "r") as json_file:
        stocks = json.load(json_file)

    filtered_stocks = [
        {
            "stockSymbol": stock_symbol,
            "stockName": stock["name"],
            "lastClosePrice": stock["close_price"],
            "lastPriceChange": stock["close_price"] - stock["open_price"],
            "lastPriceChangePercentage": (
                (stock["close_price"] - stock["open_price"]) / stock["open_price"]
            )
            * 100,
        }
        for stock_symbol, stock in stocks.items()
    ]

    return JsonResponse(filtered_stocks, safe=False)


@login_required
def stock(request):
    """
    Required fields in body:
    - stockSymbol: str
    - unitPrice: float
    - quantity: int > 0
    """
    if request.method == "POST":
        data = json.loads(request.body)
        user = request.user
        stock_symbol = data["stockSymbol"]
        unit_price = data["unitPrice"]
        quantity = data["quantity"]

        if quantity <= 0 or not isinstance(quantity, int):
            return JsonResponse(
                {"error": "Quantity must be greater than 0"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            with open("investfree/stock_data.json", "r") as json_file:
                stocks = json.load(json_file)
        except FileNotFoundError:
            return JsonResponse(
                {"error": "There was an error on the server"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        stock = stocks[stock_symbol]

        if stock["close_price"] != unit_price:
            return JsonResponse(
                {
                    "error": "Requested unit price does not match the current unit price, please refresh the page"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        total_amount = stock["close_price"] * quantity
        if user.money_in_account < total_amount:
            return JsonResponse(
                {"error": "You don't have enough money in your account"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.money_in_account -= total_amount

        stock_ownership = StockOwnership.objects.filter(
            user=user, stock_symbol=stock_symbol
        ).first()

        if not stock_ownership:
            stock_ownership = StockOwnership(
                user=user,
                stock_name=stock["name"],
                stock_symbol=stock_symbol,
                quantity=quantity,
                last_unit_price=stock["close_price"],
            )
        else:
            # Update profit
            stock_ownership.profit += stock_ownership.quantity * (
                stock["close_price"] - stock_ownership.last_unit_price
            )
            stock_ownership.last_unit_price = stock["close_price"]

            stock_ownership.quantity += quantity

        # transaction = Transaction.objects.create(
        #     user=user,
        #     type="buy",
        #     stock_symbol=stock["T"],
        #     stock_name=stock_name,
        #     quantity=quantity,
        #     unit_price=buy_unit_price,
        #     transaction_price=buy_unit_price * quantity,
        # )

        # Make all of db operations atomic
        with db_transaction.atomic():
            user.save()
            stock_ownership.save()
            # transaction.save()

        return JsonResponse({}, status=status.HTTP_201_CREATED)

    elif request.method == "DELETE":
        data = json.loads(request.body)
        stock_symbol = data["stockSymbol"]
        quantity = data["quantity"]
        unit_price = data["unitPrice"]
        user = request.user

        if quantity <= 0 or not isinstance(quantity, int):
            return JsonResponse(
                {"error": "Quantity must be greater than 0"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            with open("investfree/stock_data.json", "r") as json_file:
                stocks = json.load(json_file)
        except FileNotFoundError:
            return JsonResponse(
                {"error": "There was an error on the server"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        stock = stocks[stock_symbol]

        # For now don't check the unit_price for mismatch
        if stock["close_price"] != unit_price:
            return JsonResponse(
                {
                    "error": "Requested unit price does not match the current unit price, please refresh the page"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        stock_ownership = StockOwnership.objects.get(
            user=user, stock_symbol=stock_symbol
        )

        if stock_ownership.quantity < quantity:
            return JsonResponse(
                {"error": "You don't have enough stocks to sell"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Update profit
        stock_ownership.profit += stock_ownership.quantity * (
            stock["close_price"] - stock_ownership.last_unit_price
        )
        stock_ownership.last_unit_price = stock["close_price"]
        stock_ownership.profit *= 1 - (quantity / stock_ownership.quantity)

        stock_ownership.quantity -= quantity
        user.money_in_account += stock["close_price"] * quantity

        # transaction = Transaction.objects.create(
        #     user=user,
        #     type="sell",
        #     stock_symbol=stock_symbol,
        #     stock_name=stock_ownership.stock_name,
        #     quantity=quantity,
        #     unit_price=real_unit_price,
        #     transaction_price=real_unit_price * quantity,
        # )

        # Make all of db operations atomic
        with db_transaction.atomic():
            user.save()
            if stock_ownership.quantity == 0:
                stock_ownership.delete()
            else:
                stock_ownership.save()
            # transaction.save()

        return JsonResponse(
            {},
            status=status.HTTP_200_OK,
        )


def user_stocks_money(user: User) -> float:
    """
    Get the total money in stocks for a user.
    """
    with open("investfree/stock_data.json", "r") as json_file:
        api_stocks = json.load(json_file)

    stocks = StockOwnership.objects.filter(user=user)
    money_in_stocks = 0
    for stock in stocks:
        stock_price = api_stocks[stock.stock_symbol]["close_price"]
        money_in_stocks += stock.quantity * stock_price
    return money_in_stocks


@require_http_methods(["GET"])
def best_players(request):
    """
    Get the best players in the game.
    """
    users = User.objects.filter(is_superuser=False)
    best_players = [
        {
            "username": user.username,
            "dateJoined": user.date_joined,
            "numberOfStocks": len(StockOwnership.objects.filter(user=user)),
            "total": user_stocks_money(user) + user.money_in_account,
        }
        for user in users
    ]
    best_players.sort(key=lambda x: x["total"], reverse=True)
    for i, player in enumerate(best_players):
        player["placement"] = i + 1

    return JsonResponse(best_players, safe=False)


@require_http_methods(["PUT"])
def change_username(request):
    """
    Change the username of the user.
    """
    data = json.loads(request.body)
    username = data["username"]

    if not username_valid(username):
        return JsonResponse(
            {"error": "Username must be at least 3 characters long"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = request.user
    user.username = username
    try:
        user.save()
    except IntegrityError:
        return JsonResponse(
            {"error": "Username already exists"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    user.save()
    return JsonResponse({}, status=status.HTTP_200_OK)


@require_http_methods(["PUT"])
def change_email(request):
    """
    Change the email of the user.
    """
    data = json.loads(request.body)
    email = data["email"]

    if not email_valid(email):
        return JsonResponse(
            {"error": "Invalid email"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = request.user
    user.email = email
    try:
        user.save()
    except IntegrityError:
        return JsonResponse(
            {"error": "Email already exists"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    user.save()
    return JsonResponse({}, status=status.HTTP_200_OK)


@require_http_methods(["PUT"])
def change_password(request):
    """
    Change the password of the user.
    """
    data = json.loads(request.body)
    old_password = data["oldPassword"]
    new_password = data["newPassword"]
    confirm_new_password = data["confirmNewPassword"]

    if new_password != confirm_new_password:
        return JsonResponse(
            {"error": "Passwords do not match"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Validate new password
    if not password_valid(new_password):
        return JsonResponse(
            {"error": "Password does not fulfil the requirements"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = request.user
    if not user.check_password(old_password):
        return JsonResponse(
            {"error": "Old password is incorrect"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    user.set_password(new_password)
    user.save()
    return JsonResponse({}, status=status.HTTP_200_OK)
