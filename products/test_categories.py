from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from products.models import Category


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
