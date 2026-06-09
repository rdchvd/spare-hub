from django.db import models

from accounts.models import Seller
from core.models import Audit


class Product(Audit):

    class CurrencyChoices(models.TextChoices):
        USD = "USD", "US Dollar"
        EUR = "EUR", "Euro"
        UAH = "UAH", "Hryvnia"

    class ConditionChoices(models.TextChoices):
        NEW = "new", "New"
        USED = "used", "Used"
        REFURBISHED = "refurbished", "Refurbished"

    seller = models.ForeignKey(
        Seller,
        on_delete=models.SET_NULL,
        related_name="products",
        null=True,
        blank=True,
    )

    name = models.CharField(max_length=255)

    brand = models.CharField(max_length=100)

    description = models.TextField(blank=True)

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    currency = models.CharField(
        max_length=3,
        choices=CurrencyChoices.choices,
        default=CurrencyChoices.USD,
    )

    condition = models.CharField(
        max_length=20,
        choices=ConditionChoices.choices,
        default=ConditionChoices.NEW,
    )

    quantity = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name
