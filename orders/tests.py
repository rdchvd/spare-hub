from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from orders.models import Order, OrderDetail
from orders.serializers import OrderSerializer
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
            "details": [
                {
                    "product": self.product.id,
                    "quantity": 2,
                    "price": "100.00",
                }
            ],
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        order = Order.objects.get()
        self.assertEqual(response.data["id"], order.id)
        self.assertEqual(order.user, self.user)
        self.assertEqual(order.status, "pending")
        self.assertEqual(order.details.count(), 1)
        detail = order.details.first()
        self.assertEqual(detail.product, self.product)
        self.assertEqual(detail.quantity, 2)
        self.assertEqual(str(detail.price), "100.00")

    def test_get_orders(self):
        order = Order.objects.create(user=self.user)
        OrderDetail.objects.create(
            order=order,
            product=self.product,
            quantity=2,
            price="100.00",
        )
        response = self.client.get("/api/orders/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected = OrderSerializer(
            Order.objects.filter(user=self.user),
            many=True,
        ).data
        self.assertEqual(response.data["results"], expected)

    def test_update_order(self):
        order = Order.objects.create(user=self.user, status="pending")
        url = f"/api/orders/{order.id}/"
        response = self.client.patch(
            url,
            {
                "status": "paid",
                "details": [
                    {
                        "product": self.product.id,
                        "quantity": 1,
                        "price": "100.00",
                    }
                ],
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        order.refresh_from_db()
        self.assertEqual(order.status, "paid")
        self.assertEqual(response.data["id"], order.id)
        self.assertEqual(response.data["status"], "paid")

    def test_delete_order(self):
        order = Order.objects.create(user=self.user)

        OrderDetail.objects.create(
            order=order,
            product=self.product,
            quantity=2,
            price="100.00",
        )
        self.assertEqual(Order.objects.count(), 1)
        url = f"/api/orders/{order.id}/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Order.objects.count(), 0)
        self.assertFalse(Order.objects.filter(id=order.id).exists())

    def test_create_order_with_invalid_product(self):
        response = self.client.post(
            "/api/orders/",
            {
                "status": "pending",
                "details": [
                    {
                        "product": 9999,
                        "quantity": 1,
                        "price": "100.00",
                    }
                ],
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_order_model_contains_details(self):
        order = Order.objects.create(user=self.user)

        OrderDetail.objects.create(
            order=order,
            product=self.product,
            quantity=2,
            price="100.00",
        )
        self.assertEqual(order.details.count(), 1)
        detail = order.details.first()
        self.assertEqual(detail.product, self.product)
        self.assertEqual(detail.quantity, 2)
        self.assertEqual(str(detail.price), "100.00")

    def test_create_order_without_details(self):
        response = self.client.post(
            "/api/orders/",
            {
                "status": "pending",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("details", response.data)

    def test_user_cannot_see_other_users_orders(self):
        other_user = User.objects.create_user(
            email="other@test.com", password="testpass123"
        )
        Order.objects.create(user=other_user)
        Order.objects.create(user=self.user)
        response = self.client.get("/api/orders/")
        returned_ids = [o["id"] for o in response.data["results"]]
        self.assertEqual(len(returned_ids), 1)
        self.assertTrue(
            Order.objects.filter(id=returned_ids[0], user=self.user).exists()
        )

    def test_update_order_replaces_details(self):
        order = Order.objects.create(user=self.user)
        OrderDetail.objects.create(
            order=order,
            product=self.product,
            quantity=2,
            price="100.00",
        )
        new_product = Product.objects.create(name="New Product", price=50)
        url = f"/api/orders/{order.id}/"
        response = self.client.patch(
            url,
            {
                "status": "paid",
                "details": [
                    {
                        "product": new_product.id,
                        "quantity": 1,
                        "price": "50.00",
                    }
                ],
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        order.refresh_from_db()
        self.assertEqual(order.details.count(), 1)
        detail = order.details.first()
        self.assertEqual(detail.product, new_product)
        self.assertEqual(detail.quantity, 1)

    def test_create_order_with_empty_details_list(self):
        response = self.client.post(
            "/api/orders/",
            {
                "status": "pending",
                "details": [],
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("details", response.data)

    def test_create_order_with_incomplete_detail(self):
        response = self.client.post(
            "/api/orders/",
            {
                "status": "pending",
                "details": [
                    {
                        "product": self.product.id,
                        # quantity missing
                        "price": "100.00",
                    }
                ],
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_order_ignores_client_price_and_uses_product_price(self):
        response = self.client.post(
            "/api/orders/",
            {
                "status": "pending",
                "details": [
                    {
                        "product": self.product.id,
                        "quantity": 1,
                        "price": "9999.00",
                    }
                ],
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        detail = OrderDetail.objects.first()
        self.assertEqual(str(detail.price), "100.00")

    def test_get_single_order(self):
        order = Order.objects.create(user=self.user)
        OrderDetail.objects.create(
            order=order,
            product=self.product,
            quantity=2,
            price="100.00",
        )
        url = f"/api/orders/{order.id}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], order.id)
        self.assertEqual(len(response.data["details"]), 1)
