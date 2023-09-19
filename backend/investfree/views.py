from django.shortcuts import render
from .models import User, Stock, Transaction
from .serializers import UserSerializer, StockSerializer, TransactionSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class UserView(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.data
        serializer = UserSerializer(data=user)
        if serializer.is_valid(raise_exception=True):
            user_saved = serializer.save()
        return Response({"success": f"User '{user_saved.username}' created successfully"})
    

class StockView(APIView):
    def get(self, request):
        stocks = Stock.objects.all()
        serializer = StockSerializer(stocks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        stock = request.data
        serializer = StockSerializer(data=stock)
        if serializer.is_valid(raise_exception=True):
            stock_saved = serializer.save()
        return Response({"success": f"Stock '{stock_saved.name}' created successfully"})
