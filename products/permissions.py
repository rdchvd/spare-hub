from rest_framework.permissions import BasePermission

from accounts.models import Seller


class IsSeller(BasePermission):

    def has_permission(self, request, view):
        if view.action == "create":
            return Seller.objects.filter(user=request.user).exists()

        return True


class IsProductOwner(BasePermission):

    def has_object_permission(self, request, view, obj):
        if not obj.seller:
            return False

        return obj.seller.user_id == request.user.id
