from django.db import models


class PageData(models.Model):
    link = models.OneToOneField("Link", on_delete=models.CASCADE, null=False)

    title = models.TextField()
    description = models.TextField()
    h1_first = models.TextField()
    h1_second = models.TextField()
    h2_first = models.TextField()
    h2_second = models.TextField()
