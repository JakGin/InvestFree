from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    path("api/users/", views.UserView.as_view(), name="users"),
    path("api/stocks/", views.StockView.as_view(), name="stocks")
]

urlpatterns = format_suffix_patterns(urlpatterns)
