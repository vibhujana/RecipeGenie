from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import Profile, Recipe

# serializer: python object <-> json


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True, 'required': True}, 'email': {'required': True, 'validators': [UniqueValidator(queryset=User.objects.all())]}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'title', 'ingredients', 'tools', 'budget', 'cook_time', 'skill_level', 'dietary_restrictions', 'user', 'created_at']
        extra_kwargs = {'user': {'read_only': True}}

class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ['id', 'title', 'ingredients', 'instructions', 'preparation_time', 'cook_time', 'servings', 'nutrition_facts', 'user', 'created_at']
        extra_kwargs = {'user': {'read_only': True}}
