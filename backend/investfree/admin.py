from django.contrib import admin
from .models import User, Stock, Transaction


admin.site.register(User)
admin.site.register(Stock)
admin.site.register(Transaction)
