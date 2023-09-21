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

from .validators import validate_register


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
    def get(self, request):
        if request.user.is_authenticated == False:
            return Response({"error": "You must be logged in"}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            user = User.objects.get(username=request.user.username)
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


class LoginView(APIView):
    def post(self, request):
        try:
            username = request.data["username"]
            password = request.data["password"]
        except KeyError:
            return Response({"error": "username and password required"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return Response({"success": f"User '{user.username}' logged in successfully"})
        else:
            return Response({"error": "Invalid username and/or password"}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"success": "User logged out successfully"})


class RegisterView(APIView):
    def post(self, request):
        try:
            username = request.data["username"]
            email = request.data["email"]
            password = request.data["password"]
            confirmation = request.data["confirmation"]
        except KeyError:
            return Response({"error": "username, email, password, and confirmation required"}, status=status.HTTP_400_BAD_REQUEST)

        check = validate_register(username, email, password, confirmation)
        if "error" in check:
            return Response({"error": check["error"]}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)
        login(request, user)
        return Response({"success": f"User '{user.username}' created successfully"})
