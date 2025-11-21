from rest_framework.routers import DefaultRouter

from accounts.views import UserProfileViewSet

router = DefaultRouter()
router.register(r"profiles", UserProfileViewSet)
