from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class User(AbstractUser):
    money_on_account = models.FloatField(default=100000.00)


class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stock_symbol = models.CharField(max_length=10)
    stock_name = models.CharField(max_length=50)
    quantity = models.IntegerField()
    unit_price = models.FloatField()
    buy_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} bought {self.quantity} shares of {self.stock_name} at ${self.unit_price} on {self.buy_date}"
