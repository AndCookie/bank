# Generated by Django 5.1 on 2024-08-25 18:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0002_payment_pay_date_payment_transaction_unique_number_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='payment',
            name='transaction_type',
            field=models.CharField(default='출금', max_length=15),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='payment',
            name='bank_account',
            field=models.CharField(max_length=30),
        ),
    ]