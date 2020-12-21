# Generated by Django 3.0.5 on 2020-11-30 10:04

from django.db import migrations


def add_permissions(apps, schema_editor):
    # do nothing
    pass


def remove_permissions(apps, schema_editor):
    # remove permissions from previous migrations
    ContentType = apps.get_model("contenttypes.ContentType")
    Permission = apps.get_model("auth.Permission")
    try:
        content_type = ContentType.objects.get(
            model="site",
            app_label="crawl",
        )
        # This cascades to Group
        Permission.objects.filter(
            content_type=content_type,
            codename__in=("can_see_images", "can_see_page_size", "can_see_seo"),
        ).delete()
    except Exception:
        pass


class Migration(migrations.Migration):

    dependencies = [
        ("crawl", "0029_auto_20201130_1003"),
    ]

    operations = [
        migrations.RunPython(remove_permissions, add_permissions),
    ]
