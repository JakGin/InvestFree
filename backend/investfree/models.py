from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    # money_in_account is the amount of money not invested yet
    money_in_account = models.FloatField(default=1000000.00)

    def __str__(self):
        return f"{self.username}, {self.email} joined {self.date_joined} has ${self.money_in_account} in their account not invested."


class StockOwnership(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stock_symbol = models.CharField(max_length=10)
    stock_name = models.CharField(max_length=100)
    quantity = models.IntegerField()
    profit = models.FloatField(default=0.0)
    last_unit_price = models.FloatField(default=0.0)

    def __str__(self):
        return f"{self.user.username} has {self.quantity} shares of {self.stock_name} ({self.stock_symbol})."


class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=8, choices=[("buy", "Buy"), ("sell", "Sell")])
    stock_symbol = models.CharField(max_length=8)
    stock_name = models.CharField(max_length=100)
    quantity = models.IntegerField()
    unit_price = models.FloatField()
    transaction_price = models.FloatField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        operation = "bought" if self.type == "buy" else "sold"
        return f"{self.user.username} {operation} {self.quantity} units of {self.stock_symbol} for ${self.transaction_price} at {self.date}."
