from django.shortcuts import render
from .models import User, Stock, Transaction
from .serializers import UserSerializer, StockSerializer, TransactionSerializer
from rest_framework.views import APIView
from rest_framework.response import Response


class UserView(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response({"users": serializer.data})

    def post(self, request):
        user = request.data.get('user')
        serializer = UserSerializer(data=user)
        if serializer.is_valid(raise_exception=True):
            user_saved = serializer.save()
        return Response({"success": "User '{}' created successfully".format(user_saved.username)})
    

class StockView(APIView):
    def get(self, request):
        stocks = Stock.objects.all()
        serializer = StockSerializer(stocks, many=True)
        return Response({"stocks": serializer.data})

    def post(self, request):
        stock = request.data.get('stock')
        serializer = StockSerializer(data=stock)
        if serializer.is_valid(raise_exception=True):
            stock_saved = serializer.save()
        return Response({"success": f"Stock '{stock_saved.name}' created successfully"})
