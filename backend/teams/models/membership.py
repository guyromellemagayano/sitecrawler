from functools import cached_property

from django.contrib.auth.models import User, Permission
from django.db import models
from .membership_type import MembershipType


class Membership(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(auto_now=True, null=False)

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    team = models.ForeignKey("Team", on_delete=models.CASCADE)
    type = models.ForeignKey("MembershipType", on_delete=models.CASCADE)

    sites = models.ManyToManyField("crawl.Site", blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "team"], name="membership_unique_user_team"),
        ]
        permissions = (("can_manage_membership", "Can manage team"),)

    @cached_property
    def permissions(self):
        return {
            f"{x.content_type.app_label}.{x.codename}": x
            for x in Permission.objects.select_related("content_type").filter(
                models.Q(group__in=[self.team.plan.group_id, self.type.group_id])
                | models.Q(group__user=self.user_id)
                | models.Q(user=self.user_id)
            )
        }

    def delete(self):
        team = self.team
        has_other_owner = False
        for team_membership in team.membership_set.all():
            if team_membership.user_id != self.user_id and team_membership.type_id == MembershipType.OWNER:
                has_other_owner = True

        # delete team if it has no other owner
        if not has_other_owner:
            team.soft_delete()

        super().delete()
