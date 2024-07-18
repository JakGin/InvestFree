import json
import csv

from datetime import datetime

from django.contrib.auth import authenticate, login, logout, get_user_model
from django.db import IntegrityError
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


# TODO the money in stock should be calculated based on the current stock price # not the price when the user bought it
@login_required
@require_http_methods(["GET"])
def get_user(request):
    """
    Get user data including his wallet and stocks.
    """
    user = request.user
    transactions = Transaction.objects.filter(user=user, sell_date__isnull=True)
    transactions_list = [
        {
            "stock_symbol": transaction.stock_symbol,
            "stock_name": transaction.stock_name,
            "quantity": transaction.quantity,
            "buy_unit_price": transaction.buy_unit_price,
            "buy_date": transaction.buy_date,
            "current_benefit": transaction.quantity
            * (transaction.buy_unit_price - transaction.buy_unit_price),
            "current_percentage_benefit": (
                transaction.buy_unit_price - transaction.buy_unit_price
            )
            / transaction.buy_unit_price
            * 100,
        }
        for transaction in transactions
    ]

    user_data = {
        "username": user.username,
        "email": user.email,
        "money_in_account": user.money_in_account,
        "money_in_stocks": sum(
            transaction.quantity * transaction.buy_unit_price
            for transaction in transactions
        ),
        "stocks": transactions_list,
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
    # with open("investfree/stock_data_previous.json", "r") as json_file:
    #     data = json.load(json_file)
    #     previous_stocks = data["results"]

    with open("investfree/symbol_name_mapping.csv") as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=",", quotechar='"')
        symbol_name_mapping = {row[0]: row[1] for row in csv_reader}
    filtered_stocks = [
        stock for stock in stocks if stock.get("T") in symbol_name_mapping
    ]

    for stock in filtered_stocks:
        stock["name"] = symbol_name_mapping[stock["T"]]
        stock["todayPriceChange"] = stock["c"] - stock["o"]
        stock["todayPriceChangePercentage"] = (
            stock["todayPriceChange"] / stock["o"]
        ) * 100

    filtered_stocks.sort(key=lambda x: x["T"])

    return JsonResponse(filtered_stocks, safe=False)


@login_required
def stock(request):
    """
    Required fields in body:
    - stockSymbol: str
    - unitPrice: float
    - quantity: int > 0
    -* buyDate: str (only for DELETE method)
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

        if user.money_in_account < buy_unit_price * quantity:
            return JsonResponse(
                {"error": "You don't have enough money in your account"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.money_in_account -= buy_unit_price * quantity
        user.save()

        transaction = Transaction.objects.create(
            user=user,
            stock_symbol=stock_symbol,
            stock_name=stock_symbol,
            quantity=quantity,
            buy_unit_price=buy_unit_price,
        )
        transaction.save()

        return JsonResponse(
            {
                "stock_symbol": transaction.stock_symbol,
                "stock_name": transaction.stock_name,
                "quantity": transaction.quantity,
                "buy_unit_price": transaction.buy_unit_price,
                "buy_date": transaction.buy_date,
            },
            status=status.HTTP_201_CREATED,
        )

    elif request.method == "DELETE":
        data = json.loads(request.body)
        user = request.user
        stock_symbol = data["stockSymbol"]
        unit_price = data["unitPrice"]
        quantity = data["quantity"]
        buy_date = data["buyDate"]

        if quantity <= 0 or not isinstance(quantity, int):
            return JsonResponse(
                {"error": "Quantity must be greater than 0"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        transaction = Transaction.objects.filter(
            user=user,
            stock_symbol=stock_symbol,
            quantity=quantity,
            # buy_date=buy_date,
            sell_date__isnull=True,
        ).first()

        if transaction is None:
            return JsonResponse(
                {"error": "Transaction not found"},
                status=status.HTTP_404_NOT_FOUND,
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
        sell_unit_price = stock["c"]

        # Check if the is not front-back unit price mismatch
        if sell_unit_price != unit_price:
            return JsonResponse(
                {
                    "error": "Requested unit price does not match the current unit price, please refresh the page"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.money_in_account += sell_unit_price * quantity
        user.save()

        transaction.sell_unit_price = sell_unit_price
        transaction.sell_date = timezone.now()
        transaction.save()

        return JsonResponse(
            {
                "stock_symbol": transaction.stock_symbol,
                "stock_name": transaction.stock_name,
                "quantity": transaction.quantity,
                "buy_unit_price": transaction.buy_unit_price,
                "buy_date": transaction.buy_date,
                "sell_unit_price": transaction.sell_unit_price,
                "sell_date": transaction.sell_date,
            },
            status=status.HTTP_200_OK,
        )
