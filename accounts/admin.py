from django.contrib import admin

# from .models import User, UserProfile, Seller
from accounts.models import Seller, User, UserProfile


class UserAdmin(admin.ModelAdmin):
    search_fields = ["email"]
    list_display = ("email", "is_staff", "is_active")
    list_filter = ("is_active", "is_staff", "is_superuser")


class SellerAdmin(admin.ModelAdmin):
    def formfield_for_manytomany(self, db_field, request, **kwargs):
        if db_field.name == "user":
            kwargs["queryset"] = User.objects.filter(profile__role="seller")
        return super().formfield_for_manytomany(db_field, request, **kwargs)

    list_display = ("company_name", "phone_number", "address")
    search_fields = ("company_name", "phone_number")


class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name", "phone_number", "role", "user")
    search_fields = ("first_name", "last_name", "phone_number", "user__email")
    list_filter = ("role",)
    ordering = ("last_name", "first_name")


admin.site.register(User, UserAdmin)
admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(Seller, SellerAdmin)
