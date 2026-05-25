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

    def test_protected_without_token(self):
        response = self.client.get(self.protected_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_protected_with_token(self):
        login_response = self.client.post(
            self.login_url,
            {
                "email": "existing@test.com",
                "password": "StrongPass123",
            },
            format="json",
        )

        token = login_response.data["token"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        response = self.client.get(self.protected_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logout_success(self):
        login_response = self.client.post(
            self.login_url,
            {
                "email": "existing@test.com",
                "password": "StrongPass123",
            },
            format="json",
        )

        token = login_response.data["token"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        response = self.client.post(self.logout_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logout_without_token(self):
        response = self.client.post(self.logout_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_profile_authorized(self):
        login_response = self.client.post(
            self.login_url,
            {
                "email": "existing@test.com",
                "password": "StrongPass123",
            },
            format="json",
        )

        token = login_response.data["token"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        response = self.client.get(self.protected_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "existing@test.com")

    def test_get_profile_unauthorized(self):
        response = self.client.get(self.protected_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_profile(self):
        login_response = self.client.post(
            self.login_url,
            {
                "email": "existing@test.com",
                "password": "StrongPass123",
            },
            format="json",
        )

        token = login_response.data["token"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        response = self.client.patch(
            self.protected_url,
            {
                "first_name": "UpdatedName",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["first_name"], "UpdatedName")

    def test_update_profile_invalid_data(self):
        login_response = self.client.post(
            self.login_url,
            {
                "email": "existing@test.com",
                "password": "StrongPass123",
            },
            format="json",
        )

        token = login_response.data["token"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        response = self.client.patch(
            self.protected_url,
            {
                "email": "not-an-email",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_account(self):
        login_response = self.client.post(
            self.login_url,
            {
                "email": "existing@test.com",
                "password": "StrongPass123",
            },
            format="json",
        )

        token = login_response.data["token"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        response = self.client.delete(self.protected_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
