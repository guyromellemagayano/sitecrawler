from django.contrib import admin

from .models import Signup


@admin.register(Signup)
class SignupAdmin(admin.ModelAdmin):
    list_display = ("email", "url")
