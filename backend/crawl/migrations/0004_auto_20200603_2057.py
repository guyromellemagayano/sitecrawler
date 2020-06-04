# Generated by Django 3.0.5 on 2020-06-03 20:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crawl', '0003_site_last_verify_error'),
    ]

    operations = [
        migrations.AlterField(
            model_name='link',
            name='status',
            field=models.PositiveSmallIntegerField(choices=[(1, 'OK'), (2, 'TIMEOUT'), (3, 'HTTP_ERROR'), (4, 'OTHER_ERROR')]),
        ),
    ]
