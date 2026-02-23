from django.utils import timezone
from rest_framework import mixins, status, viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
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

    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["last_name", "first_name", "user__email", "created_at"]
    search_fields = ["first_name", "last_name", "user__email", "phone_number"]
    ordering = ["user__email"]

    def destroy(self, request, *args, **kwargs):
        profile = self.get_object()
        user_to_delete = profile.user

        user_to_delete.is_active = False
        user_to_delete.deleted_at = timezone.now()
        user_to_delete.save()

        profile.deleted_at = timezone.now()
        profile.save()

        return Response(status=status.HTTP_204_NO_CONTENT)
