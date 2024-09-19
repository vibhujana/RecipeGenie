from django.db import models

from django.contrib.auth.models import User


class Profile(models.Model):
    BEGINNER = 'Beginner'
    INTERMEDIATE = 'Intermediate'
    ADVANCED = 'Advanced'

    SKILL_LEVEL_CHOICES = [
        (BEGINNER, 'Beginner'),
        (INTERMEDIATE, 'Intermediate'),
        (ADVANCED, 'Advanced'),
    ]

    title = models.CharField(max_length=100)
    ingredients = models.TextField()
    tools = models.TextField()
    budget = models.PositiveIntegerField()
    cook_time = models.PositiveIntegerField()
    skill_level = models.CharField(max_length=12, choices=SKILL_LEVEL_CHOICES, default=BEGINNER)
    dietary_restrictions = models.TextField(default="")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='profiles')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Recipe(models.Model):
    title = models.CharField(max_length=100)
    ingredients = models.TextField()
    instructions = models.TextField()
    preparation_time = models.PositiveIntegerField()  
    cook_time = models.PositiveIntegerField()
    servings = models.PositiveIntegerField()
    nutrition_facts = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recipes')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title