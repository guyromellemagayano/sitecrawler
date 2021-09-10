def get_current_team(request):
    membership = get_current_membership(request)
    if not hasattr(membership, "team"):
        return None
    return membership.team


def get_current_membership(request):
    if hasattr(request, "membership"):
        return request.membership
    if not hasattr(request.user, "membership_set"):
        return None
    request.membership = (
        request.user.membership_set.select_related("team__plan", "type").filter(team__deleted_at__isnull=True).first()
    )
    return request.membership


def has_permission(request, permission, membership=None):
    if membership is None:
        membership = get_current_membership(request)
    if membership is None:
        return False
    return permission in membership.permissions
