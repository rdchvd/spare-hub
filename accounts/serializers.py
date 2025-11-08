from rest_framework import serializers

from accounts.models import User, UserProfile


class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "email",
        ]


class CreateUserProfileSerializer(serializers.ModelSerializer):
    user = CreateUserSerializer()

    class Meta:
        model = UserProfile
        fields = ["first_name", "last_name", "role", "user"]
