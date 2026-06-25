from rest_framework import serializers

from accounts.serializers import SellerSerializer
from products.models import Category, Product


class ProductSerializer(serializers.ModelSerializer):

    seller = SellerSerializer(read_only=True)

    price = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0)

    class Meta:
        model = Product
        fields = "__all__"
        read_only_fields = ["seller"]


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = "__all__"
