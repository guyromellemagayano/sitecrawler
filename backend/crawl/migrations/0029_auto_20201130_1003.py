# Generated by Django 3.0.5 on 2020-11-30 10:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crawl', '0028_auto_20201126_1443'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='link',
            options={'permissions': (('can_see_images', 'Can see images'), ('can_see_scripts', 'Can see scripts'), ('can_see_stylesheets', 'Can see stylesheets'), ('can_see_pages', 'Can see pages'))},
        ),
        migrations.AlterModelOptions(
            name='site',
            options={},
        ),
    ]
