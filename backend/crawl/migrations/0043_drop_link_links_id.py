# Generated by Django 3.0.5 on 2021-04-26 07:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("crawl", "0042_auto_20210426_0744"),
    ]

    operations = [
        migrations.RunSQL("ALTER TABLE crawl_link_links DROP COLUMN id"),
    ]