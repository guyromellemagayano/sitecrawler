# Generated by Django 3.2.6 on 2021-08-26 07:17

from django.db import migrations
from ..models import Plan as RealPlanModel


def forwards_func(apps, schema_editor):
    Group = apps.get_model("auth", "Group")
    Plan = apps.get_model("teams", "Plan")
    for id, name in RealPlanModel.ID_CHOICES[:3]:
        new_group_name = f"Plan - {name}"
        try:
            group = Group.objects.get(name__contains=name)
            group.name = new_group_name
            group.save()
        except Group.DoesNotExist:
            group = Group.objects.create(name=new_group_name)

        Plan.objects.get_or_create(id=id, group=group)


def reverse_func(apps, schema_editor):
    Plan = apps.get_model("teams", "Plan")
    for id, _ in RealPlanModel.ID_CHOICES[:3]:
        plan = Plan.objects.get(id=id)
        plan.group.delete()
        plan.delete()


class Migration(migrations.Migration):

    dependencies = [
        ("teams", "0006_auto_20210826_0716"),
    ]

    operations = [
        migrations.RunPython(forwards_func, reverse_func),
    ]
