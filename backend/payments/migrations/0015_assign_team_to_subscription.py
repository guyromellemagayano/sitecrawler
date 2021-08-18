# Generated by Django 3.2.6 on 2021-08-18 08:31

from django.db import migrations


def forwards_func(apps, schema_editor):
    UserSubscription = apps.get_model("payments", "UserSubscription")
    for us in UserSubscription.objects.all():
        if not us.team_id:
            us.team_id = us.user.membership_set.first().team_id
            us.save()


class Migration(migrations.Migration):

    dependencies = [
        ("payments", "0014_usersubscription_team"),
    ]

    operations = [
        migrations.RunPython(forwards_func),
    ]
