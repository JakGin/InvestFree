from django.urls import path
from . import views


urlpatterns = [
    path("register/", views.UserRegister.as_view(), name="register"),
    path("login/", views.UserLogin.as_view(), name="login"),
    path("logout/", views.UserLogout.as_view(), name="logout"),
    path("user/", views.get_user, name="user"),

    path("change_username/", views.change_username, name="change_username"),
    path("change_email/", views.change_email, name="change_email"),
    path("change_password/", views.change_password, name="change_password"),

    path("get_stocks_data/", views.get_stocks_data, name="get_stocks_data"),
    # transaction POST DELETE
    path("stock/", views.stock, name="stock"),
    path("best_players/", views.best_players, name="best_players"),
]
