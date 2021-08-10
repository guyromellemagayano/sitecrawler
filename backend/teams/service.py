def get_current_team(request):
    return request.user.membership_set.select_related("team").first().team
