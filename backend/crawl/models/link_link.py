from django.db import models


class LinkLink(models.Model):
    from_link = models.ForeignKey("Link", on_delete=models.CASCADE, related_name="link_links")
    to_link = models.ForeignKey("Link", on_delete=models.CASCADE, related_name="source_link_links")

    class Meta:
        db_table = "crawl_link_links"
        unique_together = [
            ["from_link", "to_link"],
        ]
