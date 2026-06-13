from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import UserProfile

User = get_user_model()


class BaseAuthTestCase(APITestCase):

    def setUp(self):
        self.register_url = "/api/auth/register/"
        self.login_url = "/api/auth/token/"
        self.logout_url = "/api/auth/logout/"
        self.profile_me = "/api/auth/me/"

        self.user_data = {
            "email": "test@test.com",
            "password": "StrongPass123",
            "first_name": "John",
            "last_name": "Doe",
            "phone_number": "380000000000",
            "role": "buyer",
        }

        self.user = User.objects.create_user(
            email="existing@test.com",
            password="StrongPass123",
        )
        UserProfile.objects.create(
            user=self.user,
            first_name="Existing",
            last_name="User",
            phone_number="380000000000",
            role="buyer",
        )

    def authorize(self):
        response = self.client.post(
            self.login_url,
            {
                "email": "existing@test.com",
                "password": "StrongPass123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)

        access = response.data.get("access")
        self.assertIsNotNone(access)

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")


class RegisterTests(BaseAuthTestCase):

    def test_register_success(self):
        response = self.client.post(self.register_url, self.user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_register_duplicate_email(self):
        self.client.post(self.register_url, self.user_data, format="json")
        response = self.client.post(self.register_url, self.user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LoginTests(BaseAuthTestCase):

    def test_login_success(self):
        response = self.client.post(
            self.login_url,
            {
                "email": "existing@test.com",
                "password": "StrongPass123",
            },
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_login_invalid_password(self):
        response = self.client.post(
            self.login_url,
            {
                "email": "existing@test.com",
                "password": "wrong",
            },
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class LogoutTests(BaseAuthTestCase):

    def test_logout_success(self):
        login_response = self.client.post(
            self.login_url,
            {
                "email": "existing@test.com",
                "password": "StrongPass123",
            },
            format="json",
        )

        access = login_response.data["access"]
        refresh = login_response.data["refresh"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")

        response = self.client.post(
            self.logout_url,
            {"refresh": refresh},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)

    def test_logout_without_token(self):
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ProfileTests(BaseAuthTestCase):

    def test_get_profile(self):
        self.authorize()
        response = self.client.get(self.profile_me)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_profile(self):
        self.authorize()
        response = self.client.patch(
            self.profile_me,
            {
                "first_name": "Updated",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
