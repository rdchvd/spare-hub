from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import Seller, User
from products.models import Category, Product


class CategoryApiTests(APITestCase):

    def setUp(self):
        self.url = "/api/categories/"

        self.admin = User.objects.create_superuser(
            email="admin@test.com",
            password="StrongPass123",
        )

        self.user = User.objects.create_user(
            email="user@test.com",
            password="StrongPass123",
        )

        self.seller_user = User.objects.create_user(
            email="seller@test.com",
            password="StrongPass123",
        )

        self.seller = Seller.objects.create(
            user=self.seller_user, company_name="Test seller"
        )

    def test_list_categories_available_for_everyone(self):
        Category.objects.create(name="Engine")
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

    def test_admin_can_create_category(self):

        self.client.force_authenticate(self.admin)
        response = self.client.post(
            self.url,
            {"name": "Engine"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.count(), 1)

    def test_user_cannot_update_category(self):
        category = Category.objects.create(name="Engine")
        self.client.force_authenticate(self.user)
        response = self.client.patch(
            f"{self.url}{category.id}/",
            {"name": "Updated"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_cannot_delete_category(self):
        category = Category.objects.create(name="Engine")
        self.client.force_authenticate(self.user)
        response = self.client.delete(f"{self.url}{category.id}/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_cannot_create_category(self):

        self.client.force_authenticate(self.user)
        response = self.client.post(
            self.url,
            {"name": "Engine"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_delete_category(self):

        category = Category.objects.create(name="Engine")
        self.client.force_authenticate(self.admin)
        response = self.client.delete(f"{self.url}{category.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Category.objects.exists())

    def test_duplicate_category_name_not_allowed(self):

        Category.objects.create(name="Engine")
        self.client.force_authenticate(self.admin)
        response = self.client.post(
            self.url,
            {"name": "Engine"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Category.objects.count(), 1)

    def test_admin_can_update_category(self):
        category = Category.objects.create(name="Engine")

        self.client.force_authenticate(self.admin)

        response = self.client.patch(
            f"{self.url}{category.id}/",
            {
                "name": "Suspension",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        category.refresh_from_db()
        self.assertEqual(category.name, "Suspension")

    def test_filter_products_by_category(self):
        category = Category.objects.create(name="Engine")
        product = Product.objects.create(
            name="Test",
            brand="BMW",
            price=100,
            currency="USD",
            condition="new",
            quantity=1,
            seller=self.seller,
        )
        product.category.set([category])
        url = f"/api/products/?category={category.id}"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["results"]), 1)

    def test_search_categories_by_name(self):
        Category.objects.create(name="Engine")
        url = "/api/categories/?search=eng"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data["results"]), 1)

    def test_search_categories_no_results(self):
        url = "/api/categories/?search=xxxxx"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 0)
