def get_current_team(request):
    return get_current_membership(request).team


def get_current_membership(request):
    if hasattr(request, "membership"):
        return request.membership
    request.membership = (
        request.user.membership_set.select_related("team__plan", "type").filter(team__deleted_at__isnull=True).first()
    )
    return request.membership


def has_permission(request, permission, membership=None):
    if membership is None:
        membership = get_current_membership(request)
    return permission in membership.permissions
