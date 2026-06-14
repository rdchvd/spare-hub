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

        self.product_url = f"/api/products/{self.product.id}/"

        self.admin = User.objects.create_superuser(
            email="admin@test.com",
            password="StrongPass123",
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

    def test_list_products_as_buyer(self):
        self.login(
            "buyer@test.com",
            "StrongPass123",
        )

        response = self.client.get(self.products_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(len(response.data["results"]), 1)

    def test_list_products_as_seller(self):
        self.login(
            "seller@test.com",
            "StrongPass123",
        )

        response = self.client.get(self.products_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(
            len(response.data["results"]),
            1,
        )


class ProductCreateTests(BaseProductTestCase):

    def test_seller_can_create_product(self):
        self.login(
            "seller@test.com",
            "StrongPass123",
        )

        before_count = Product.objects.count()

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

        after_count = Product.objects.count()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(after_count, before_count + 1)

        product = Product.objects.latest("id")

        self.assertEqual(product.name, "MacBook")
        self.assertEqual(product.brand, "Apple")
        self.assertEqual(str(product.price), "2000.00")
        self.assertEqual(product.quantity, 5)

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

    def test_create_product_without_login(self):
        before_count = Product.objects.count()

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

        after_count = Product.objects.count()

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(after_count, before_count)

    def test_create_product_invalid_fields(self):
        self.login(
            "seller@test.com",
            "StrongPass123",
        )

        before_count = Product.objects.count()

        response = self.client.post(
            self.products_url,
            {
                "name": "",
                "brand": "",
                "price": "-100",
                "currency": "AAA",
                "quantity": -1,
            },
            format="json",
        )

        after_count = Product.objects.count()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(after_count, before_count)


class ProductUpdateTests(BaseProductTestCase):

    def test_owner_can_update(self):
        self.login(
            "seller@test.com",
            "StrongPass123",
        )

        payload = {
            "name": "MacBook Pro",
            "brand": "Apple Updated",
            "description": "Updated laptop",
            "price": "2500.00",
            "currency": "EUR",
            "condition": "used",
            "quantity": 10,
        }

        response = self.client.patch(
            f"{self.products_url}{self.product.id}/",
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.product.refresh_from_db()

        self.assertEqual(self.product.name, payload["name"])
        self.assertEqual(self.product.brand, payload["brand"])
        self.assertEqual(self.product.description, payload["description"])
        self.assertEqual(str(self.product.price), payload["price"])
        self.assertEqual(self.product.currency, payload["currency"])
        self.assertEqual(self.product.condition, payload["condition"])
        self.assertEqual(self.product.quantity, payload["quantity"])

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

    def test_update_product_without_login(self):
        response = self.client.patch(
            self.product_url,
            {
                "name": "Updated",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_buyer_cannot_update_product(self):
        self.login(
            "buyer@test.com",
            "StrongPass123",
        )

        response = self.client.patch(
            self.product_url,
            {
                "name": "Updated",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_update_product(self):
        self.login(
            "admin@test.com",
            "StrongPass123",
        )

        response = self.client.patch(
            self.product_url,
            {
                "name": "Admin Updated",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class ProductMyTests(BaseProductTestCase):

    def setUp(self):
        super().setUp()

        Product.objects.create(
            seller=self.seller,
            name="MacBook",
            brand="Apple",
            price="2000.00",
            quantity=2,
        )

        Product.objects.create(
            seller=self.other_seller,
            name="Samsung",
            brand="Samsung",
            price="1500.00",
            quantity=3,
        )

    def test_my_products_as_seller(self):

        self.login(
            "seller@test.com",
            "StrongPass123",
        )

        response = self.client.get(self.my_products_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_my_products_as_second_seller(self):

        self.login(
            "other@test.com",
            "StrongPass123",
        )

        response = self.client.get(self.my_products_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_my_products_as_buyer(self):

        self.login(
            "buyer@test.com",
            "StrongPass123",
        )

        response = self.client.get(self.my_products_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_my_products_as_admin(self):

        self.login(
            "admin@test.com",
            "StrongPass123",
        )

        response = self.client.get(self.my_products_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_my_products_without_login(self):

        response = self.client.get(self.my_products_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
