from django.urls import path
from . import views


urlpatterns = [
    path("register/", views.UserRegister.as_view(), name="register"),
    path("login/", views.UserLogin.as_view(), name="login"),
    path("logout/", views.UserLogout.as_view(), name="logout"),
    path("user/", views.get_user, name="user"),
    path("get_stocks_data/", views.get_stocks_data, name="get_stocks_data"),
    # transaction POST DELETE
    path("stock/", views.stock, name="stock"),
]
