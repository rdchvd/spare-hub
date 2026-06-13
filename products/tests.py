from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import Seller
from products.models import Product

User = get_user_model()


class BaseProductTestCase(APITestCase):

    def setUp(self):
        self.products_url = "/api/products/"
        self.my_products_url = "/api/products/my/"

        self.seller_user = User.objects.create_user(
            email="seller@test.com",
            password="StrongPass123",
        )

        self.other_user = User.objects.create_user(
            email="other@test.com",
            password="StrongPass123",
        )

        self.buyer = User.objects.create_user(
            email="buyer@test.com",
            password="StrongPass123",
        )

        self.seller = Seller.objects.create(
            user=self.seller_user,
            company_name="Test Seller",
        )

        self.other_seller = Seller.objects.create(
            user=self.other_user,
            company_name="Other Seller",
        )

        self.product = Product.objects.create(
            seller=self.seller,
            name="iPhone",
            brand="Apple",
            description="Phone",
            price=Decimal("1000.00"),
            quantity=1,
        )

    def login(self, email, password):
        response = self.client.post(
            "/api/auth/token/",
            {
                "email": email,
                "password": password,
            },
            format="json",
        )

        token = response.data["access"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")


class ProductListTests(BaseProductTestCase):

    def test_list_products(self):

        response = self.client.get(self.products_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(len(response.data["results"]), 1)


class ProductCreateTests(BaseProductTestCase):

    def test_seller_can_create_product(self):
        self.login(
            "seller@test.com",
            "StrongPass123",
        )

        response = self.client.post(
            self.products_url,
            {
                "name": "MacBook",
                "brand": "Apple",
                "description": "Laptop",
                "price": "2000.00",
                "currency": "USD",
                "condition": "new",
                "quantity": 5,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_buyer_cannot_create_product(self):
        self.login(
            "buyer@test.com",
            "StrongPass123",
        )

        response = self.client.post(
            self.products_url,
            {
                "name": "MacBook",
                "brand": "Apple",
                "price": "1000",
                "quantity": 1,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class ProductUpdateTests(BaseProductTestCase):

    def test_owner_can_update(self):
        self.login(
            "seller@test.com",
            "StrongPass123",
        )

        response = self.client.patch(
            f"{self.products_url}{self.product.id}/",
            {
                "name": "Updated",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_non_owner_cannot_update(self):
        self.login(
            "other@test.com",
            "StrongPass123",
        )

        response = self.client.patch(
            f"{self.products_url}{self.product.id}/",
            {
                "name": "Hack",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class ProductMyTests(BaseProductTestCase):

    def test_my_products(self):
        self.login(
            "seller@test.com",
            "StrongPass123",
        )

        response = self.client.get(self.my_products_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
