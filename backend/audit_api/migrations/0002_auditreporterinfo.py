from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('audit_api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AuditReporterInfo',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('website_url', models.URLField()),
                ('user_name', models.CharField(max_length=255)),
                ('phone_number', models.CharField(max_length=20)),
                ('submission_date', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('task', models.OneToOneField(
                    blank=True,
                    null=True,
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='reporter_info',
                    to='audit_api.audittask',
                )),
            ],
            options={
                'ordering': ['-submission_date'],
            },
        ),
    ]
