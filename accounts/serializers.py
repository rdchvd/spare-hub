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
            raise serializers.ValidationError("У вас не має прав для створення адміна")

        user = User.objects.create(**user_data)
        validated_data["user_id"] = user.id
        return super().create(validated_data)


# todo: додай тут код
#     def update
