from rest_framework import permissions

from teams.models import Membership
from teams.service import has_permission


# This class checks permissions based on kwargs team id not current team as HasPermission
def HasTeamDetailPermission(perm):
    class HasPermissionClass(permissions.BasePermission):
        message = "This feature is not available for you."

        def has_permission(self, request, view):
            team_id = None
            if "parent_lookup_team" in view.kwargs:
                team_id = view.kwargs["parent_lookup_team"]
            elif "pk" in view.kwargs:
                team_id = view.kwargs["pk"]
            membership = Membership.objects.select_related("team__plan", "type").get(
                team_id=team_id, user_id=request.user.id
            )
            return has_permission(request, perm, membership=membership)

    return HasPermissionClass
