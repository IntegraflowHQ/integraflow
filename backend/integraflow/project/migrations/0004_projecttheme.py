# Generated by Django 3.2.23 on 2023-11-26 20:23

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import integraflow.core.utils.uuidt


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('project', '0003_alter_project_slug'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProjectTheme',
            fields=[
                ('id', models.UUIDField(default=integraflow.core.utils.uuidt.UUIDT, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(blank=True, max_length=400)),
                ('color_scheme', models.JSONField(blank=True, null=True)),
                ('settings', models.JSONField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='project_themes', related_query_name='project_theme', to=settings.AUTH_USER_MODEL)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='themes', related_query_name='theme', to='project.project')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
