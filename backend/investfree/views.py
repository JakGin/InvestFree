from django.shortcuts import render
from .models import User, Stock, Transaction
from .serializers import UserSerializer, StockSerializer, TransactionSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required



class UsersView(APIView):
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
    
    
class UserView(APIView):
    ''' Get information about a specific user '''
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        if (request.user != user):
            return Response({"error": "You do not have permission to view this user"}, status=status.HTTP_401_UNAUTHORIZED)
        
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


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


def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return Response({"success": f"User '{user.username}' logged in successfully"})
        else:
            return Response({"error": "Invalid username and/or password"}, status=status.HTTP_401_UNAUTHORIZED)   
    else:
        return Response({"error": "Only POST request allowed"}, status=status.HTTP_400_BAD_REQUEST)


def logout_view(request):
    logout(request)
    return Response({"success": "User logged out successfully"})


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return Response({"error": "Passwords don't match"}, status=status.HTTP_400_BAD_REQUEST)

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)
        login(request, user)
        return Response({"success": f"User '{user.username}' created successfully"})
    else:
        return Response({"error": "Only POST request allowed"}, status=status.HTTP_400_BAD_REQUEST)
