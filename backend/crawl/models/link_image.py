from django.db import models


# this model (as well as other relations models have had id dropped manually,
# which doesn't work with django orm.
# Use raw queries and set it to something when querying.
# When it's used through many-many relationship it works fine
class LinkImage(models.Model):
    from_link = models.ForeignKey("Link", on_delete=models.CASCADE, related_name="link_images")
    to_link = models.ForeignKey("Link", on_delete=models.CASCADE, related_name="source_link_images")

    alt_text = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "crawl_link_images"
        unique_together = [
            ["from_link", "to_link"],
        ]
