from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

    def create(self, clean_data):
        username = clean_data["username"]
        email = clean_data["email"]
        password = clean_data["password"]

        user = User.objects.create_user(
            username=username, password=password, email=email
        )
        user.save()
        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def check_user(self, clean_data):
        username = clean_data["username"]
        password = clean_data["password"]
        user = authenticate(username=username, password=password)
        if not user:
            return None
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "email")
