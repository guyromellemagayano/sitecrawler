# Generated by Django 3.2.7 on 2021-10-06 12:47

from django.contrib.auth.management import create_permissions
from django.db import migrations


def forwards_func(apps, schema_editor):
    for app_config in apps.get_app_configs():
        app_config.models_module = True
        create_permissions(app_config, verbosity=0)
        app_config.models_module = None

    Group = apps.get_model("auth", "Group")
    Permission = apps.get_model("auth", "Permission")
    for name in ["MembershipType - Owner", "MembershipType - Member"]:
        group = Group.objects.get(name=name)
        perm = Permission.objects.get(codename="can_see_all_sites")
        group.permissions.add(perm)


class Migration(migrations.Migration):

    dependencies = [
        ("teams", "0018_alter_membershiptype_id"),
        ("crawl", "0062_alter_site_options"),
    ]

    operations = [
        migrations.RunPython(forwards_func),
    ]
