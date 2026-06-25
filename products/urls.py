from rest_framework.routers import DefaultRouter

from products.views import CategoryViewSet, ProductViewSet

router = DefaultRouter()
router.register(r"products", ProductViewSet)
router.register("categories", CategoryViewSet)

urlpatterns = router.urls
