from django.utils import timezone
from rest_framework import mixins, status, viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from accounts.models import UserProfile
from accounts.serializers import UserProfileSerializer


class UserProfileViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = (
        UserProfile.objects.filter(deleted_at__isnull=True).select_related("user").all()
    )
    serializer_class = UserProfileSerializer

    def destroy(self, request, *args, **kwargs):
        profile = self.get_object()
        user_to_delete = profile.user
        request_user = request.user

        if request_user.is_staff:
            user_to_delete.is_active = False
            user_to_delete.save()

            profile.deleted_at = timezone.now()
            profile.save()

            return Response(
                {"detail": f"User {user_to_delete.username} has been deactivated."},
                status=status.HTTP_200_OK,
            )

        if request_user == user_to_delete:
            user_to_delete.is_active = False
            user_to_delete.deleted_at = timezone.now()
            user_to_delete.save()

            profile.deleted_at = timezone.now()
            profile.save()

            return Response(
                {"detail": "Your account has been deactivated."},
                status=status.HTTP_200_OK,
            )

        raise PermissionDenied("You can only delete your own account.")
