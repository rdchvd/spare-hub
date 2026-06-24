from rest_framework import serializers

from accounts.serializers import SellerSerializer
from products.models import Category, Product


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):

    seller = SellerSerializer(read_only=True)

    category = CategorySerializer(read_only=True)

    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
        required=False,
    )

    price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        min_value=0,
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "seller",
            "name",
            "brand",
            "description",
            "price",
            "currency",
            "condition",
            "quantity",
            "category",
            "category_id",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["seller"]
