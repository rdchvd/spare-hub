from rest_framework.routers import DefaultRouter

from accounts.views import UserProfileViewSet, UserViewSet

router = DefaultRouter()
router.register(r"profiles", UserProfileViewSet)
router.register(r"users", UserViewSet)
