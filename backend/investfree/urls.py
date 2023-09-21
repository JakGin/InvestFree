from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    # Auth
    path("api/register/", views.RegisterView.as_view(), name="register"),
    path("api/login/", views.LoginView.as_view(), name="login"),
    path("api/logout/", views.LogoutView.as_view(), name="logout"),

    # Main
    path("api/users/", views.UsersView.as_view(), name="users"),
    path("api/user", views.UserView.as_view(), name="user"),
    path("api/stocks/", views.StockView.as_view(), name="stocks")
]

urlpatterns = format_suffix_patterns(urlpatterns)
