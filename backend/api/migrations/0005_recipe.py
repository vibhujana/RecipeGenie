# Generated by Django 5.1.1 on 2024-09-17 21:04

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_profile_dietary_restrictions'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Recipe',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('ingredients', models.TextField()),
                ('instructions', models.TextField()),
                ('preperation_time', models.PositiveIntegerField()),
                ('cook_time', models.PositiveIntegerField()),
                ('servings', models.PositiveIntegerField()),
                ('nutrition_fact', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='recipes', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
