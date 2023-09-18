from django.shortcuts import render
from django.http import HttpResponse, JsonResponse


def index(request):
    return HttpResponse("Hello, world. You're at the investfree index.")


def stocks(request):
    return JsonResponse({
        "stocks": "Hello api stocks route",                  
    })