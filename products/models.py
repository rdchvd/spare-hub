from django.db import models

from accounts.models import Seller
from core.models import Audit


class Product(Audit):
    seller = models.ForeignKey(
        Seller, on_delete=models.CASCADE, related_name="products"
    )

    name = models.CharField(max_length=255)

    description = models.TextField(blank=True)

    price = models.DecimalField(max_digits=10, decimal_places=2)

    quantity = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name
