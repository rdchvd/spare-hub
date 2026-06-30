from rest_framework import serializers

from orders.models import Order, OrderDetail


class OrderDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderDetail
        fields = ["id", "product", "quantity", "price"]
        read_only_fields = ["id"]


class OrderSerializer(serializers.ModelSerializer):
    details = OrderDetailSerializer(many=True, required=False)

    class Meta:
        model = Order
        fields = ["id", "user", "order_date", "status", "details"]
        read_only_fields = ["user", "order_date"]

    def create(self, validated_data):
        details_data = validated_data.pop("details", [])
        order = Order.objects.create(**validated_data)

        for item in details_data:
            OrderDetail.objects.create(order=order, **item)

        return order

    def update(self, instance, validated_data):
        details_data = validated_data.pop("details", None)

        instance.status = validated_data.get("status", instance.status)
        instance.save()

        if details_data is not None:
            instance.details.all().delete()
            for item in details_data:
                OrderDetail.objects.create(order=instance, **item)

        return instance
