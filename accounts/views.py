from rest_framework import mixins, viewsets

from accounts.models import User, UserProfile
from accounts.serializers import UserDetailSerializer, UserProfileSerializer

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


class UserProfileViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer


class UserViewSet(
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    queryset = User.objects.select_related("profile").all()
    serializer_class = UserDetailSerializer


# class UserProfileDestroyViewSet(mixins.DestroyModelMixin, viewsets.GenericViewSet):
#     queryset = UserProfile.objects.all()
#     serializer_class = UserProfileSerializer
#     permission_classes = (IsAdminUser,)
