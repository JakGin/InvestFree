from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    wallet_status = models.FloatField(default=100000.00)
    debt = models.FloatField(default=0.00)
    watchlist = models.ManyToManyField("Stock", blank=True, related_name="watchlist")
    portfolio = models.ManyToManyField("Stock", blank=True, related_name="portfolio")


class Stock(models.Model):
    name = models.CharField(max_length=20)
    symbol = models.CharField(max_length=5)
    price = models.FloatField()
    # description = models.CharField(max_length=1000)
    # website = models.CharField(max_length=1000)
    # image_url = models.CharField(max_length=1000)

    def __str__(self):
        return f"{self.name} ({self.symbol})"
    

class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.FloatField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} bought {self.quantity} shares of {self.stock.name} at ${self.price} on {self.date}"