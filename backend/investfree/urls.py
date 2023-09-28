from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    # Auth
    path("register", views.RegisterView.as_view(), name="register"),
    path("login", views.LoginView.as_view(), name="login"),
    path("logout", views.LogoutView.as_view(), name="logout"),

    # Main
    path("users", views.UsersView.as_view(), name="users"),
    path("user", views.UserView.as_view(), name="user"),
    path("stocks", views.StockView.as_view(), name="stocks")
]

urlpatterns = format_suffix_patterns(urlpatterns)
