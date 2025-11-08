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

    def create(self, validated_data):
        user_data = validated_data.pop("user")
        user = User.objects.create(**user_data)
        print(f"{user=}")
        return super().create(validated_data)
