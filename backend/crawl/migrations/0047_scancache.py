# Generated by Django 3.1.12 on 2021-06-16 07:19

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('crawl', '0046_groupsettings_recrawl_frequency'),
    ]

    operations = [
        migrations.CreateModel(
            name='ScanCache',
            fields=[
                ('scan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='crawl.scan')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('data', django.contrib.postgres.fields.jsonb.JSONField()),
            ],
        ),
    ]
