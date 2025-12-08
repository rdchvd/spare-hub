from rest_framework import mixins, viewsets

from accounts.models import UserProfile
from accounts.serializers import UserProfileSerializer


class UserProfileViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = UserProfile.objects.select_related("user").all()
    serializer_class = UserProfileSerializer
