# Generated by Django 2.1.5 on 2019-03-10 00:00

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth_api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='tickers',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, default='', max_length=255), default=list, null=True, size=None),
        ),
    ]
