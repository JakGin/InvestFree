from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    path("users/", views.UserView.as_view()),
    path("stocks/", views.StockView.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
