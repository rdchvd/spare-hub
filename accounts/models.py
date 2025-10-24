from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django.utils import timezone
from phonenumber_field.modelfields import PhoneNumberField

from accounts.managers import CustomUserManager


class Audit(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True


class User(AbstractBaseUser, Audit, PermissionsMixin):
    email = models.EmailField(unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

class UserProfile(Audit):
    ROLE_CHOICES = [
        ('seller', 'Seller'),
        ('buyer', 'Buyer'),
        ('admin', 'Admin'),
    ]

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    # pip install "django-phonenumber-field[phonenumberslite]"
    phone_number = PhoneNumberField()
    role = models.CharField(max_length=7, choices=ROLE_CHOICES, default="buyer")
    user = models.OneToOneField(User, on_delete=models.PROTECT, related_name="profile")

    def __str__(self):
        return f"{self.first_name} {self.last_name}"



class Seller(Audit, models.Model):
    company_name = models.CharField(max_length=50)
    phone_number = PhoneNumberField()
    address = models.TextField()
    user = models.ManyToManyField(User, related_name="seller", blank=True)

    def __str__(self):
        return (f'Name company: {self.company_name}'
                f'Phone number: {self.phone_number}'
                f'Address: {self.address}')
    # class Meta:
    #     ordering = ['-created_at']
    #     verbose_name_plural = "sellers"
    #     permissions = ()


