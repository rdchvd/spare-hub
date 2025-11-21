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

    # def get(self, request):
    #     request_user = self.context["request"].user
    #     auth = request.headers.get("Authorization")

    # def update(self, instance, validated_data):
    #     request_user = self.context["request"].user
    #     user_data = validated_data.pop("user", None)
    #     role = validated_data.get("role", instance.role)
    #
    #     if role == "admin" and not request_user.is_superuser:
    #         raise serializers.ValidationError("У вас не має прав для створення адміна")
    #
    #     if user_data:
    #         user = instance.user
    #         if "email" in user_data:
    #             user.email = user_data["email"]
    #         if ("is_staff") in user_data:
    #             user.is_staff = user_data["is_staff"]
    #         user.save()
    #
    #     instance.role = role
    #     instance.first_name = user_data["first_name"]
    #     instance.last_name = user_data["last_name"]
    #     instance.save()
    #
    #     return instance
