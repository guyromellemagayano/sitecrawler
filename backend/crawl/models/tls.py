from django.db import models
from django.contrib.postgres.fields import ArrayField, JSONField


class Tls(models.Model):
    not_before = models.DateTimeField(null=False)
    not_after = models.DateTimeField(null=False)
    common_name = models.TextField(null=False)
    organization = models.TextField(null=False)
    dns_names = ArrayField(models.TextField(), default=list, null=False)
    issuer_organization = models.TextField(null=False)
    issuer_cn = models.TextField(null=False)
    cipher_suite = models.CharField(max_length=128, null=False)
    version = models.CharField(max_length=8, null=False)
    errors = JSONField(null=True)
