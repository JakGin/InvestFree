import json

from django.contrib.auth import authenticate, login, logout, get_user_model
from django.db import IntegrityError
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

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
    return JsonResponse(data)
