from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class AuthTests(APITestCase):

    def setUp(self):
        self.register_url = "/api/auth/register/"
        self.login_url = "/api/auth/login/"
        self.protected_url = "/api/profiles/"

        self.user_data = {
            "email": "testgm@test.com",
            "password": "2423589",
            "first_name": "John",
            "last_name": "Doe",
            "phone_number": "380974467431",
            "role": "buyer",
        }

        self.user = User.objects.create_user(
            email="existing@test.com",
            password="StrongPass123",
            first_name="Existing",
            last_name="User",
            phone_number="380000000000",
            role="buyer",
        )

    def test_register_success(self):
        response = self.client.post(
            self.register_url,
            self.user_data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)

        user = User.objects.get(email="testgm@test.com")
        self.assertEqual(user.first_name, "John")
        self.assertEqual(user.role, "buyer")

    def test_register_duplicate_email(self):
        self.client.post(
            self.register_url,
            self.user_data,
            format="json",
        )

        response = self.client.post(
            self.register_url,
            self.user_data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_success(self):
        response = self.client.post(
            self.login_url,
            {
                "email": "existing@test.com",
                "password": "StrongPass123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)

    def test_login_invalid_password(self):
        response = self.client.post(
            self.login_url,
            {
                "email": "existing@test.com",
                "password": "WrongPassword",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
