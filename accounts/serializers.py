from rest_framework import serializers

from accounts.models import User, UserProfile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "email",
        ]


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = UserProfile
        fields = ["first_name", "last_name", "role", "user"]

    def create(self, validated_data):
        request_user = self.context["request"].user
        user_data = validated_data.pop("user")
        role = validated_data.get("role")

        if role == "admin" and not request_user.is_superuser:
            raise serializers.ValidationError(
                "You do not have the rights to create an admin"
            )

        user = User.objects.create(**user_data)
        validated_data["user_id"] = user.id
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request_user = self.context["request"].user
        user_data = validated_data.pop("user", None)
        role = validated_data.get("role", instance.role)

        if role == "admin" and not request_user.is_superuser:
            raise serializers.ValidationError(
                "You do not have permission to assign admin role"
            )

        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()

        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.last_name = validated_data.get("last_name", instance.last_name)
        instance.role = role
        instance.save()

        return instance
