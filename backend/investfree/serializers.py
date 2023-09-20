from .models import User, Stock, Transaction
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):


    class Meta:
        model = User
        fields = ["username", "email", "wallet_status", "debt"]


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ["name", "symbol", "price"]


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ["user", "stock", "quantity", "price"]
