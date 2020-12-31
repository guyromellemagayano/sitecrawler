# Generated by Django 3.0.5 on 2020-12-30 12:18

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Signup',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('first_name', models.CharField(blank=True, max_length=150)),
                ('last_name', models.CharField(blank=True, max_length=150)),
                ('username', models.CharField(blank=True, max_length=150)),
                ('email', models.EmailField(max_length=254)),
                ('url', models.CharField(max_length=2048)),
                ('token', models.CharField(max_length=128)),
            ],
        ),
    ]
