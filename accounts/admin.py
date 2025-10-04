from django.contrib import admin

# Register your models here.
# accounts/admin.py
from django.contrib import admin
from .models import User, UserProfile, Seller

admin.site.register(User)
admin.site.register(UserProfile)
admin.site.register(Seller)
