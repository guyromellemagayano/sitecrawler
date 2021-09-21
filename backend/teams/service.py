def get_current_team(request):
    membership = get_current_membership(request)
    if not hasattr(membership, "team"):
        return None
    return membership.team


def set_current_team(request, team):
    if hasattr(team, "id"):
        team_id = team.id
    else:
        team_id = team
    request.session["team_id"] = team_id


def get_current_membership(request):
    if hasattr(request, "membership"):
        return request.membership
    if not hasattr(request.user, "membership_set"):
        return None

    query = request.user.membership_set.select_related("team__plan", "type").filter(team__deleted_at__isnull=True)
    membership = None
    team_id = request.session.get("team_id")
    if team_id:
        membership = query.filter(team_id=team_id).first()
    if membership is None:
        membership = query.first()

    request.membership = membership
    return membership


def has_permission(request, permission, membership=None):
    if membership is None:
        membership = get_current_membership(request)
    if membership is None:
        return False
    return permission in membership.permissions
