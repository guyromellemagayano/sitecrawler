from django.contrib.postgres.fields import JSONField
from django.db import models


class FifoEntry(models.Model):
    scan = models.ForeignKey("Scan", on_delete=models.CASCADE, null=False)
    url = models.TextField()
    depth = models.PositiveIntegerField()


class FifoRelation(models.Model):
    entry = models.ForeignKey("FifoEntry", on_delete=models.CASCADE, null=False)
    parent_id = models.PositiveIntegerField()
    child_type = models.PositiveSmallIntegerField()
    data = JSONField(null=True, blank=True)
