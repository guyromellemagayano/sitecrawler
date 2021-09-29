from rest_framework import permissions

from teams.service import has_permission


def HasPermission(perm):
    class HasPermissionClass(permissions.BasePermission):
        message = "This feature is not available for you."

        def has_permission(self, request, view):
            return has_permission(request, perm)

    return HasPermissionClass
