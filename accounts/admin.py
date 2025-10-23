
from django.contrib import admin
from .models import User, UserProfile, Seller

class UserAdmin(admin.ModelAdmin):
    search_fields = ("email", "first_name", "last_name")
    list_display = ("email", "is_staff", "is_active")
    list_filter = ("is_active", "is_staff", "is_superuser")

class SellerAdmin(admin.ModelAdmin):
    def formfield_for_manytomany(self, db_field, request, **kwargs):
        if db_field.name == "user":
            kwargs["queryset"] = User.objects.filter(is_superuser=False)
        return super().formfield_for_manytomany(db_field, request, **kwargs)


admin.site.register(User, UserAdmin)
admin.site.register(UserProfile)
admin.site.register(Seller, SellerAdmin)