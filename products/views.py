from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)
from rest_framework.response import Response

from products.models import Product
from products.permissions import IsProductOwner
from products.serializers import ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):

    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.action in ["update", "partial_update", "destroy"]:
            return [
                IsAuthenticated(),
                IsProductOwner(),
            ]

        if self.action in ["create", "my"]:
            return [IsAuthenticated()]

        return [AllowAny()]

    def get_queryset(self):
        if self.action == "my":
            return Product.objects.filter(seller__user=self.request.user)

        return Product.objects.all()

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user.seller)

    @action(
        detail=False,
        methods=["get"],
    )
    def my(self, request):

        serializer = self.get_serializer(
            self.get_queryset(),
            many=True,
        )
        return Response(serializer.data)
