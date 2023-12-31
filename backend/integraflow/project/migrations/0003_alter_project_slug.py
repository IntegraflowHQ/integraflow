# Generated by Django 3.2.23 on 2023-11-20 10:21

from django.db import migrations
import integraflow.core.models
import integraflow.core.utils


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0002_auto_20231120_0736'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='slug',
            field=integraflow.core.models.LowercaseSlugField(default=integraflow.core.utils.generate_default_slug_project, max_length=48),
        ),
    ]
