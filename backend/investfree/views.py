from django.contrib.auth import authenticate, login, logout, get_user_model
from django.db import IntegrityError
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer
from .models import User, Stock, Transaction
from .validations import validate_register_data

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
        return Response({"error": "User with that username already exist"}, status=status.HTTP_400_BAD_REQUEST)


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
            return Response({"error": "Invalid username and/or password"}, status=status.HTTP_400_BAD_REQUEST)


class UserLogout(APIView):
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)


class UserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({"user": serializer.data}, status=status.HTTP_200_OK)
