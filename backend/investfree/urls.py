from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    # Auth
    path("register/", views.register, name="register"),
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout"),

    # API
    path("api/users/", views.UsersView.as_view(), name="users"),
    path("api/users/<str:username>/", views.UserView.as_view(), name="user"),
    path("api/stocks/", views.StockView.as_view(), name="stocks")
]

urlpatterns = format_suffix_patterns(urlpatterns)
