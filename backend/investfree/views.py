import json
import csv

from datetime import datetime

from django.contrib.auth import authenticate, login, logout, get_user_model
from django.db import transaction as db_transaction
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.utils import timezone
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer
from .models import *
from .validations import validate_register_data
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required


def get_user_stocks(user: User) -> tuple[list, float]:
    """
    Returns a tuple where first argument is list of user's stocks in this format:
    [
        {
            "stockSymbol": str,
            "stockName": str,
            "quantity": int,
            "lastClosePrice": float,
            "lastPriceChange": float,
            "lastPriceChangePercentage": float,
            "profit": float
        },
        ...
    ]
    and second argument the money in stocks.
    """

    stocks_owned = StockOwnership.objects.filter(user=user)

    with open("investfree/stock_data.json", "r") as json_file:
        data = json.load(json_file)
        stocks_from_api: list = data["results"]

    money_in_stocks = 0
    stocks_owned_list = []
    for stock in stocks_owned:
        current_close_price = 0
        current_open_price = 0

        for stock_api in stocks_from_api:
            if stock_api["T"] == stock.stock_symbol:
                current_close_price = stock_api["c"]
                current_open_price = stock_api["o"]
                break

        money_in_stocks += current_close_price * stock.quantity

        transactions = Transaction.objects.filter(
            user=user, stock_symbol=stock.stock_symbol
        ).order_by("-date")

        profit = 0
        count_shares = 0
        user_shares = stock.quantity
        success = False

        for transaction in transactions:
            if transaction.type == "buy":
                count_shares += transaction.quantity
                if count_shares >= user_shares:
                    units = transaction.quantity - (count_shares - user_shares)
                    success = True
                else:
                    units = transaction.quantity
                profit += units * (current_close_price - transaction.unit_price)

        if not success:
            profit = 0

        stocks_owned_list.append(
            {
                "stockSymbol": stock.stock_symbol,
                "stockName": stock.stock_name,
                "quantity": stock.quantity,
                "lastClosePrice": current_close_price,
                "lastPriceChange": current_close_price - current_open_price,
                "lastPriceChangePercentage": (
                    (current_close_price - current_open_price) / current_open_price
                )
                * 100,
                "profit": profit,
            }
        )
    return stocks_owned_list, money_in_stocks


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
        data = json.load(json_file)
        stocks = data["results"]

    with open("investfree/symbol_name_mapping.csv") as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=",", quotechar='"')
        symbol_name_mapping = {row[0]: row[1] for row in csv_reader}
    filtered_stocks = [
        {
            "stockSymbol": stock["T"],
            "stockName": symbol_name_mapping[stock["T"]],
            "lastClosePrice": stock["c"],
            "lastPriceChange": stock["c"] - stock["o"],
            "lastPriceChangePercentage": ((stock["c"] - stock["o"]) / stock["o"]) * 100,
        }
        for stock in stocks
        if stock.get("T") in symbol_name_mapping
    ]

    filtered_stocks.sort(key=lambda x: x["stockSymbol"])

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
                stock_data = json.load(json_file)
        except FileNotFoundError:
            return JsonResponse(
                {"error": "There was an error on the server"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        stocks = stock_data["results"]
        stock = [stock for stock in stocks if stock.get("T") == stock_symbol]
        if len(stock) == 0:
            return JsonResponse(
                {"error": f"Stock with symbol {stock_symbol} not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        stock = stock[0]
        buy_unit_price = stock["c"]

        if buy_unit_price != unit_price:
            return JsonResponse(
                {
                    "error": "Requested unit price does not match the current unit price, please refresh the page"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        total_amount = buy_unit_price * quantity
        if user.money_in_account < total_amount:
            return JsonResponse(
                {"error": "You don't have enough money in your account"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.money_in_account -= total_amount

        stock_ownership = StockOwnership.objects.filter(
            user=user, stock_symbol=stock_symbol
        ).first()

        with open("investfree/symbol_name_mapping.csv") as csv_file:
            csv_reader = csv.reader(csv_file, delimiter=",", quotechar='"')
            symbol_name_mapping = {row[0]: row[1] for row in csv_reader}
            stock_name = symbol_name_mapping[stock_symbol]

        if not stock_ownership:
            stock_ownership = StockOwnership(
                user=user,
                stock_name=stock_name,
                stock_symbol=stock["T"],
                quantity=quantity,
            )
        else:
            stock_ownership.quantity += quantity

        transaction = Transaction.objects.create(
            user=user,
            type="buy",
            stock_symbol=stock["T"],
            stock_name=stock_name,
            quantity=quantity,
            unit_price=buy_unit_price,
            transaction_price=buy_unit_price * quantity,
        )

        # Make all of db operations atomic
        with db_transaction.atomic():
            user.save()
            stock_ownership.save()
            transaction.save()

        return JsonResponse({}, status=status.HTTP_201_CREATED)

    elif request.method == "DELETE":
        data = json.loads(request.body)
        stock_symbol = data["stockSymbol"]
        quantity = data["quantity"]
        user = request.user

        if quantity <= 0 or not isinstance(quantity, int):
            return JsonResponse(
                {"error": "Quantity must be greater than 0"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            with open("investfree/stock_data.json", "r") as json_file:
                stock_data = json.load(json_file)
        except FileNotFoundError:
            return JsonResponse(
                {"error": "There was an error on the server"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        stocks = stock_data["results"]
        stock = [stock for stock in stocks if stock.get("T") == stock_symbol]
        if len(stock) == 0:
            return JsonResponse(
                {"error": f"Stock with symbol {stock_symbol} not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        stock = stock[0]
        real_unit_price = stock["c"]

        # # For now don't check the unit_price for mismatch
        # if real_unit_price != unit_price:
        #     return JsonResponse(
        #         {
        #             "error": "Requested unit price does not match the current unit price, please refresh the page"
        #         },
        #         status=status.HTTP_400_BAD_REQUEST,
        #     )

        stock_ownership = StockOwnership.objects.get(
            user=user, stock_symbol=stock_symbol
        )

        if stock_ownership.quantity < quantity:
            return JsonResponse(
                {"error": "You don't have enough stocks to sell"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        stock_ownership.quantity -= quantity
        user.money_in_account += real_unit_price * quantity

        transaction = Transaction.objects.create(
            user=user,
            type="sell",
            stock_symbol=stock_symbol,
            stock_name=stock_ownership.stock_name,
            quantity=quantity,
            unit_price=real_unit_price,
            transaction_price=real_unit_price * quantity,
        )

        # Make all of db operations atomic
        with db_transaction.atomic():
            user.save()
            if stock_ownership.quantity == 0:
                stock_ownership.delete()
            else:
                stock_ownership.save()
            transaction.save()

        return JsonResponse(
            {},
            status=status.HTTP_200_OK,
        )
