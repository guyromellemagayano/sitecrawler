from functools import cached_property

from django.contrib.auth.models import User, Permission
from django.db import models


class Membership(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(auto_now=True, null=False)

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    team = models.ForeignKey("Team", on_delete=models.CASCADE)
    type = models.ForeignKey("MembershipType", on_delete=models.CASCADE)

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
