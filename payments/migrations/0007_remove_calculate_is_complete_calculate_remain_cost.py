# Generated by Django 4.2 on 2024-10-09 21:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0006_calculate_is_complete'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='calculate',
            name='is_complete',
        ),
        migrations.AddField(
            model_name='calculate',
            name='remain_cost',
            field=models.IntegerField(default=0),
        ),
    ]
