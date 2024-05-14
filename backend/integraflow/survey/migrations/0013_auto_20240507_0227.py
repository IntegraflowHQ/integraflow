# Generated by Django 3.2.23 on 2024-05-07 02:27

import django.contrib.postgres.indexes
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('survey', '0012_alter_surveyquestion_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='surveyresponse',
            name='time_taken',
        ),
        migrations.AddField(
            model_name='survey',
            name='analytics_metadata',
            field=models.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name='surveyresponse',
            name='analytics_metadata',
            field=models.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name='surveyresponse',
            name='channel',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='survey_channels', related_query_name='survey_channel', to='survey.surveychannel'),
        ),
        migrations.AddField(
            model_name='surveyresponse',
            name='event_id',
            field=models.UUIDField(blank=True, db_index=True, null=True),
        ),
        migrations.AddField(
            model_name='surveyresponse',
            name='time_spent',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddIndex(
            model_name='surveyresponse',
            index=django.contrib.postgres.indexes.GinIndex(fields=['response'], name='surveyresponse_p_meta_idx'),
        ),
        migrations.AddIndex(
            model_name='surveyresponse',
            index=django.contrib.postgres.indexes.GinIndex(fields=['analytics_metadata'], name='surveyresponse_meta_idx'),
        ),
    ]