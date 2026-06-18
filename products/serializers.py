from rest_framework import serializers

from products.models import Product


class ProductSerializer(serializers.ModelSerializer):

    price = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0)

    class Meta:
        model = Product
        fields = "__all__"
        read_only_fields = ["seller"]
