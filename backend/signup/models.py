from django.db import models


class Signup(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, null=False)

    first_name = models.CharField(max_length=150, null=False, blank=True)
    last_name = models.CharField(max_length=150, null=False, blank=True)
    username = models.CharField(max_length=150, null=False, blank=True)
    email = models.EmailField(null=False, blank=False)

    url = models.CharField(max_length=2048, null=False, blank=False)

    token = models.CharField(max_length=128, null=False, blank=False, db_index=True)
