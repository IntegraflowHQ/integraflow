# Generated by Django 3.2.23 on 2023-11-26 20:23

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import integraflow.core.utils.uuidt


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('project', '0004_projecttheme'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Survey',
            fields=[
                ('id', models.UUIDField(default=integraflow.core.utils.uuidt.UUIDT, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(blank=True, max_length=400)),
                ('slug', models.CharField(max_length=10)),
                ('type', models.CharField(choices=[('survey', 'survey'), ('quiz', 'quiz'), ('poll', 'poll'), ('custom', 'custom')], default='survey', max_length=40)),
                ('status', models.CharField(choices=[('draft', 'draft'), ('in_progress', 'in progress'), ('active', 'active'), ('paused', 'paused'), ('archived', 'archived'), ('completed', 'completed')], default='draft', max_length=40)),
                ('settings', models.JSONField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('start_date', models.DateTimeField(null=True)),
                ('end_date', models.DateTimeField(null=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='surveys', related_query_name='survey', to=settings.AUTH_USER_MODEL)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='surveys', related_query_name='survey', to='project.project')),
                ('theme', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='surveys', related_query_name='survey', to='project.projecttheme')),
            ],
            options={
                'verbose_name': 'Survey',
                'verbose_name_plural': 'Surveys',
                'db_table': 'surveys',
            },
        ),
        migrations.CreateModel(
            name='SurveyQuestion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('single', 'single'), ('multiple', 'multiple'), ('text', 'text'), ('date', 'date'), ('csat', 'csat'), ('smiley_scale', 'smiley scale'), ('numerical_scale', 'numerical scale'), ('rating', 'rating'), ('nps', 'nps'), ('form', 'form'), ('boolean', 'boolean'), ('cta', 'cta'), ('dropdown', 'dropdown'), ('integration', 'integration'), ('custom', 'custom')], default='text', max_length=40)),
                ('label', models.CharField(blank=True, max_length=400)),
                ('description', models.CharField(blank=True, max_length=1000)),
                ('slug', models.CharField(max_length=10)),
                ('max_path', models.IntegerField(null=True)),
                ('order_number', models.IntegerField(default=0)),
                ('settings', models.JSONField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('survey', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='survey_questions', related_query_name='survey_question', to='survey.survey')),
            ],
            options={
                'verbose_name': 'SurveyQuestion',
                'verbose_name_plural': 'SurveyQuestions',
                'db_table': 'survey_questions',
            },
        ),
        migrations.CreateModel(
            name='SurveyQuestionOption',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('label', models.CharField(blank=True, max_length=400)),
                ('order_number', models.IntegerField(default=0)),
                ('settings', models.JSONField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='survey_question_options', related_query_name='survey_question_option', to='survey.surveyquestion')),
            ],
            options={
                'verbose_name': 'SurveyQuestionOption',
                'verbose_name_plural': 'SurveyQuestionOptions',
                'db_table': 'survey_question_options',
            },
        ),
        migrations.CreateModel(
            name='SurveyChannel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('in_app', 'in app'), ('email', 'email'), ('link', 'link'), ('api', 'api'), ('custom', 'custom')], default='in_app', max_length=40)),
                ('triggers', models.JSONField(blank=True, null=True)),
                ('conditions', models.JSONField(blank=True, null=True)),
                ('settings', models.JSONField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('survey', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='survey_channels', related_query_name='survey_channel', to='survey.survey')),
            ],
            options={
                'verbose_name': 'SurveyChannel',
                'verbose_name_plural': 'SurveyChannels',
                'db_table': 'survey_channels',
            },
        ),
        migrations.AddConstraint(
            model_name='survey',
            constraint=models.UniqueConstraint(fields=('project', 'slug'), name='unique survey slug for project'),
        ),
    ]