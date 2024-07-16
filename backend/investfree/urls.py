from django.urls import path
from . import views


urlpatterns = [
    path("register/", views.UserRegister.as_view(), name="register"),
    path("login/", views.UserLogin.as_view(), name="login"),
    path("logout/", views.UserLogout.as_view(), name="logout"),
    # Get info about user and his transactions
    path("user/", views.UserView.as_view(), name="user"),
    # Needed paths
    # transaction POST DELETE
    # Add or delete transaction
]
