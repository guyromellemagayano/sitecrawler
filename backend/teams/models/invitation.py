import uuid
from django.db import models


class Invitation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True, null=False)

    email = models.EmailField()
    team = models.ForeignKey("Team", on_delete=models.CASCADE)
    membership_type = models.ForeignKey("MembershipType", on_delete=models.CASCADE)
    sites = models.ManyToManyField("crawl.Site", blank=True)

    def __str__(self):
        return f"Invite {self.email} to {self.team} as {self.membership_type}"
