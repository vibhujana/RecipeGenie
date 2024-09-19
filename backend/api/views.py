from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, ProfileSerializer, RecipeSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ValidationError
from .models import Profile, Recipe
from django.http import JsonResponse
from rest_framework.decorators import api_view

import openai
from openai import OpenAI

import os
import json

# Set your OpenAI API key
api_key = os.getenv('OPENAI_API_KEY')
client = OpenAI(api_key=api_key)

import traceback

class ProfileListCreate(generics.ListCreateAPIView): #list profiles created or create a new profile
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Profile.objects.filter(user=user)

    #OVERRIDES default   
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user)
        else:
            print(serializer.errors)

class ProfileDelete(generics.DestroyAPIView): #delete a profile
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Profile.objects.filter(user=user)
    

class RecipeListCreate(generics.ListCreateAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Retrieve only recipes created by the authenticated user
        return Recipe.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        profile_id = self.request.data.get('profile_id')
        overrides = self.request.data.get('overrides', '')
        print(user, profile_id, overrides)

        # Validate that profile_id is provided
        if not profile_id:
            raise ValidationError("Profile ID is required to create a recipe.")

        # Attempt to retrieve the user's profile
        try:
            profile = Profile.objects.get(id=profile_id, user=user)
        except Profile.DoesNotExist:
            raise ValidationError("Profile not found for the provided ID.")
        
        print(profile)

        # Here, you would generate the recipe using GPT, for now it's hardcoded for testing
        recipe_data = self.generate_recipe(profile, overrides)


        # Ensure all required fields are present in the generated recipe
        required_fields = ['title', 'ingredients', 'instructions', 'preparation_time', 'cook_time', 'servings', 'nutrition_facts']
        if not all(key in recipe_data for key in required_fields):
            raise ValidationError("Incomplete recipe data generated.")

        # Save the recipe data with the user and profile information
        serializer.save(
            user=user,
            title=recipe_data['title'],
            ingredients=recipe_data['ingredients'],
            instructions=recipe_data['instructions'],
            preparation_time=recipe_data['preparation_time'],
            cook_time=recipe_data['cook_time'],
            servings=recipe_data['servings'],
            nutrition_facts =recipe_data['nutrition_facts']
        )

    def generate_recipe(self, profile, overrides):
        prompt = f"""

            For ingredients, list the quantity of each ingredient. For example, "1 cup of flour, 2 eggs, 1 teaspoon of salt". Be exact with the units.
            Assume the user has basic ingredients: salt, pepper, and water
            Assume the user has basic tools: knife, cutting board, pot, and pan
            For nutritions, list the quantity of each nutrition. For example, "10g of protein, 20g of fat, 30g of carbs". Be exact with the units.
            For nutritions, include: calories, total fat, saturated fat, trans fat, colestrol, sodium, total carbohydrates, dietary fiber, sugars, protein, vitamin D, calcium, iron, potassium. 
            For vitamins if there is not a significant amount, you can exclude it.
            For instructions, list the steps to prepare the recipe. For example, "Step 1: Preheat the oven to 350 degrees. Step 2: Mix the flour, eggs, and salt in a bowl."
            You may use ingredients the user has in their pantry, and you do not have to use all of them.
            If the user has a budget, you may use ingredients that fit within that budget. You do not have to use all of the budget.
            If the user provides an override, you must not use information that contradicts the override.
        
            - Ingredients: {profile.ingredients}
            - Tools: {profile.tools}
            - Budget: {profile.budget}
            - Skill: {profile.skill_level}
            - Time: {profile.cook_time}
            - Restrictions: {profile.dietary_restrictions}

            Overrides: {overrides}

            Format the recipe as a JSON:
            {{
                "title": "Recipe Title",
                "ingredients": "Comma-separated ingredients",
                "tools": "Comma-separated tools",
                "instructions": "Newline-separated instructions",
                "preparation_time": "Minutes",
                "cook_time": "Minutes",
                "servings": "Servings",
                "nutrition_facts": "Newline-separated nutrition facts"
            }}
        """

        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                response_format={"type":"json_object"},
                messages=[
                    {"role": "system", "content": "You are a recipe bot. Generate a recipe based on the user's profile:"},
                    {"role": "user", "content": prompt}
                ]
            )

            generated_text = response.choices[0].message.content
            print(f"Generated text: {generated_text}")
            recipe_data = json.loads(generated_text)

            required_fields = ['title', 'ingredients', 'instructions', 'preparation_time', 'cook_time', 'servings', 'nutrition_facts']
            if not all(key in recipe_data for key in required_fields):
                raise ValidationError("Incomplete recipe data returned by GPT.")
            
            return recipe_data

        except json.JSONDecodeError:
            raise ValidationError("Failed to parse GPT response as JSON.")
        except openai.error.OpenAIError as e:
            print(f"OpenAI API error: {e}")
            raise ValidationError(f"OpenAI API error: {str(e)}")
        except Exception as e:
            print(f"Internal Server Error: {e}")
            raise ValidationError(f"Internal server error: {str(e)}")

class RecipeDelete(generics.DestroyAPIView): #delete a recipe
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Recipe.objects.filter(user=user)
    
    

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
