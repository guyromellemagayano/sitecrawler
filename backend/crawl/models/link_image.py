from django.db import models


class LinkImage(models.Model):
    from_link = models.ForeignKey("Link", on_delete=models.CASCADE, related_name="link_images")
    to_link = models.ForeignKey("Link", on_delete=models.CASCADE, related_name="source_link_images")

    alt_text = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "crawl_link_images"
        unique_together = [
            ["from_link", "to_link"],
        ]
