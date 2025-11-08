from rest_framework import mixins, viewsets

from accounts.models import UserProfile
from accounts.serializers import CreateUserSerializer

#
# class UserViewSet(
#     mixins.CreateModelMixin,
#     mixins.RetrieveModelMixin,
#     mixins.UpdateModelMixin,
#     mixins.DestroyModelMixin,
#     mixins.ListModelMixin,
#     viewsets.GenericViewSet,
# ):
#     queryset = User.objects.select_related("profile").all()
#     serializer_class = UserSerializer


class UserProfileViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = UserProfile.objects.select_related("user").all()
    serializer_class = CreateUserSerializer
