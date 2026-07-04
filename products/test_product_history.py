from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import Seller, User
from products.models import Category, ProductHistory


class ProductHistoryTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="seller@test.com",
            password="testpass123",
        )

        self.seller = Seller.objects.create(
            user=self.user,
        )

        self.category = Category.objects.create(
            name="Engine",
        )

        self.client.force_authenticate(self.user)

    def create_product(self):
        return self.client.post(
            reverse("product-list"),
            {
                "name": "Brake Disc",
                "brand": "Bosch",
                "description": "Front brake disc",
                "price": "120.50",
                "currency": "USD",
                "condition": "new",
                "quantity": 5,
                "category_ids": [self.category.id],
            },
            format="json",
        )

    def test_history_created_on_product_create(self):
        response = self.create_product()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ProductHistory.objects.count(), 1)

    def test_history_contains_product_data(self):
        self.create_product()
        history = ProductHistory.objects.first()
        self.assertEqual(history.name, "Brake Disc")
        self.assertEqual(history.brand, "Bosch")
        self.assertEqual(history.price, Decimal("120.50"))
        self.assertEqual(history.quantity, 5)

    def test_history_contains_categories(self):
        self.create_product()
        history = ProductHistory.objects.first()
        self.assertEqual(
            list(history.category.values_list("id", flat=True)),
            [self.category.id],
        )

    def test_history_created_on_product_update(self):
        response = self.create_product()
        self.client.patch(
            reverse("product-detail", args=[response.data["id"]]),
            {
                "price": "150.00",
            },
            format="json",
        )
        self.assertEqual(ProductHistory.objects.count(), 2)

    def test_old_history_record_is_not_modified(self):
        response = self.create_product()
        first_history = ProductHistory.objects.first()
        self.client.patch(
            reverse("product-detail", args=[response.data["id"]]),
            {
                "price": "150.00",
            },
            format="json",
        )
        first_history.refresh_from_db()
        self.assertEqual(first_history.price, Decimal("120.50"))
        latest = ProductHistory.objects.latest("product_history_id")
        self.assertEqual(latest.price, Decimal("150.00"))
