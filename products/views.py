from django_filters import rest_framework as filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import (
    AllowAny,
    IsAdminUser,
    IsAuthenticated,
)
from rest_framework.response import Response

from products.models import Category, Product
from products.permissions import IsProductOwner, IsSeller
from products.serializers import CategorySerializer, ProductSerializer


class ProductFilter(filters.FilterSet):
    category = filters.NumberFilter(field_name="category__id")
    brand = filters.CharFilter(field_name="brand", lookup_expr="iexact")
    condition = filters.CharFilter(field_name="condition", lookup_expr="iexact")

    class Meta:
        model = Product
        fields = ["category", "brand", "condition"]

    def filter_categories(self, queryset, name, value):
        category_ids = value.split(",")
        return queryset.filter(category__id__in=category_ids).distinct()


class ProductViewSet(viewsets.ModelViewSet):

    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ProductFilter

    search_fields = [
        "name",
        "brand",
        "description",
    ]

    ordering_fields = [
        "price",
        "created_at",
    ]

    ordering = ["-created_at"]

    def get_permissions(self):
        if self.action in ["update", "partial_update", "destroy"]:
            return [IsAuthenticated(), IsProductOwner()]

        if self.action == "create":
            return [IsAuthenticated(), IsSeller()]

        if self.action == "my":
            return [IsAuthenticated()]

        return [AllowAny()]

    def get_queryset(self):
        qs = Product.objects.all()

        if self.action == "my":
            qs = qs.filter(seller__user=self.request.user)

        return qs.select_related("seller").prefetch_related("category")

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user.seller)

    @action(detail=False, methods=["get"])
    def my(self, request):
        serializer = self.get_serializer(
            self.get_queryset(),
            many=True,
        )
        return Response(serializer.data)


class CategoryViewSet(viewsets.ModelViewSet):

    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    filter_backends = [SearchFilter]
    search_fields = ["name"]

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminUser()]

        return [AllowAny()]
