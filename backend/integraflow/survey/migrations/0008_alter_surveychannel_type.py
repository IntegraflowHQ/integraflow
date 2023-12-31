# Generated by Django 3.2.23 on 2023-12-12 01:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('survey', '0007_alter_surveychannel_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='surveychannel',
            name='type',
            field=models.CharField(choices=[('email', 'email'), ('link', 'link'), ('api', 'api'), ('custom', 'custom'), ('mobile_sdk', 'mobile sdk'), ('web_sdk', 'web sdk')], default='link', max_length=40),
        ),
    ]
