# Generated by Django 3.2.23 on 2023-11-26 20:23

from django.conf import settings
import django.contrib.postgres.indexes
from django.db import migrations, models
import django.db.models.deletion
import django.db.models.expressions
import django.utils.timezone
import integraflow.core.utils
import integraflow.core.utils.uuidt


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('project', '0004_projecttheme'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Person',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('attributes_last_updated_at', models.JSONField(blank=True, default=dict, null=True)),
                ('attributes_last_operation', models.JSONField(blank=True, null=True)),
                ('attributes', models.JSONField(default=dict)),
                ('is_identified', models.BooleanField(default=False)),
                ('uuid', models.UUIDField(db_index=True, default=integraflow.core.utils.uuidt.UUIDT, editable=False)),
                ('is_user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='project.project')),
            ],
            options={
                'verbose_name': 'Person',
                'verbose_name_plural': 'Persons',
                'db_table': 'persons',
            },
        ),
        migrations.CreateModel(
            name='PropertyDefinition',
            fields=[
                ('id', models.UUIDField(default=integraflow.core.utils.uuidt.UUIDT, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=400)),
                ('is_numerical', models.BooleanField(default=False)),
                ('property_type', models.CharField(blank=True, choices=[('DateTime', 'DateTime'), ('String', 'String'), ('Numeric', 'Numeric'), ('Boolean', 'Boolean')], max_length=50, null=True)),
                ('type', models.PositiveSmallIntegerField(choices=[(1, 'event'), (2, 'person'), (3, 'group')], default=1)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='property_definitions', related_query_name='project', to='project.project')),
            ],
            options={
                'verbose_name': 'PropertyDefinition',
                'verbose_name_plural': 'PropertyDefinitions',
                'db_table': 'property_definitions',
            },
        ),
        migrations.CreateModel(
            name='PersonDistinctId',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('distinct_id', models.CharField(max_length=400)),
                ('person', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='event.person')),
                ('project', models.ForeignKey(db_index=False, on_delete=django.db.models.deletion.CASCADE, to='project.project')),
            ],
            options={
                'verbose_name': 'PersonDistinctId',
                'verbose_name_plural': 'PersonDistinctIds',
                'db_table': 'person_distinct_ids',
            },
        ),
        migrations.CreateModel(
            name='EventProperty',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('event', models.CharField(max_length=400)),
                ('property', models.CharField(max_length=400)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='project.project')),
            ],
            options={
                'verbose_name': 'EventProperty',
                'verbose_name_plural': 'EventProperties',
                'db_table': 'event_properties',
            },
        ),
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('event', models.CharField(blank=True, max_length=200, null=True)),
                ('distinct_id', models.CharField(max_length=200)),
                ('properties', models.JSONField(default=dict)),
                ('timestamp', models.DateTimeField(blank=True, default=django.utils.timezone.now)),
                ('site_url', models.CharField(blank=True, max_length=200, null=True)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='project.project')),
            ],
            options={
                'verbose_name': 'Event',
                'verbose_name_plural': 'Events',
                'db_table': 'events',
            },
        ),
        migrations.AddIndex(
            model_name='propertydefinition',
            index=models.Index(django.db.models.expressions.F('project_id'), django.db.models.expressions.F('type'), django.db.models.expressions.OrderBy(django.db.models.expressions.F('name')), name='index_property_def_query'),
        ),
        migrations.AddIndex(
            model_name='propertydefinition',
            index=models.Index(fields=['project_id', 'type', 'is_numerical'], name='property_de_project_af0011_idx'),
        ),
        migrations.AddIndex(
            model_name='propertydefinition',
            index=django.contrib.postgres.indexes.GinIndex(fields=['name'], name='index_property_definition_name', opclasses=['gin_trgm_ops']),
        ),
        migrations.AddConstraint(
            model_name='propertydefinition',
            constraint=models.CheckConstraint(check=models.Q(('property_type__in', ['DateTime', 'String', 'Numeric', 'Boolean'])), name='property_type_is_valid'),
        ),
        migrations.AddConstraint(
            model_name='propertydefinition',
            constraint=integraflow.core.utils.UniqueConstraintByExpression(concurrently=False, expression='(project_id, name, type)', name='integraflow_propertydefinition_uniq'),
        ),
        migrations.AddConstraint(
            model_name='persondistinctid',
            constraint=models.UniqueConstraint(fields=('project', 'distinct_id'), name='unique distinct_id for project'),
        ),
        migrations.AddIndex(
            model_name='eventproperty',
            index=models.Index(fields=['project', 'event'], name='event_prope_project_1bdda6_idx'),
        ),
        migrations.AddIndex(
            model_name='eventproperty',
            index=models.Index(fields=['project', 'property'], name='event_prope_project_9ed267_idx'),
        ),
        migrations.AddConstraint(
            model_name='eventproperty',
            constraint=models.UniqueConstraint(fields=('project', 'event', 'property'), name='integraflow_event_property_unique_project_event_property'),
        ),
        migrations.AddIndex(
            model_name='event',
            index=models.Index(fields=['timestamp', 'project_id', 'event'], name='events_timesta_5fc7f5_idx'),
        ),
        migrations.AddIndex(
            model_name='event',
            index=models.Index(fields=['distinct_id'], name='idx_distinct_id'),
        ),
    ]