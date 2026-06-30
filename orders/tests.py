from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from orders.models import Order
from products.models import Product


class OrderTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="test@test.com", password="testpass123"
        )
        self.product = Product.objects.create(name="Test Product", price=100)
        response = self.client.post(
            "/api/auth/token/", {"email": "test@test.com", "password": "testpass123"}
        )
        self.assertEqual(response.status_code, 200)
        self.token = response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

    def test_create_order(self):
        url = "/api/orders/"
        data = {
            "status": "pending",
            "details": [{"product": self.product.id, "quantity": 2, "price": "100.00"}],
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Order.objects.count(), 1)

    def test_get_orders(self):
        Order.objects.create(user=self.user)
        response = self.client.get("/api/orders/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_order(self):
        order = Order.objects.create(user=self.user)
        url = f"/api/orders/{order.id}/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
