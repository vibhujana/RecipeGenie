from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import JsonResponse
from rest_framework.decorators import api_view
import openai
from openai import OpenAI

import os

# Set your OpenAI API key
api_key = os.getenv('OPENAI_API_KEY')
client = OpenAI(api_key=api_key)

import traceback

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

@api_view(['POST'])
def generate_prompt(request):
    prompt = request.data.get('prompt')

    if not prompt:
        return JsonResponse({'error': 'Prompt is required'}, status=400)

    try:
        user_data = {
        "ingredients": "eggs, tofu, water, garlic powder, italian seasoning",
        "tools": "Electric Stove, Pots, Pans, Measuring Cup",
        "budget": 100,
        "skill_level": "Intermediate"
        }
        user_ingredients = user_data["ingredients"]
        user_tools = user_data["tools"]
        user_budget = user_data["budget"]
        user_skill_level = user_data["skill_level"]
        complete_prompt = f"""
        You are a recipe bot that creates tasty and realistic recipes. The user will give you a list of ingredients and you will generate a recipe using those ingredients. The user may give other restrictions such as budget for extra ingredients or dietary restrictions. The user will also give cook time and skill level. At the bottom, the user will provid addition information. If there is a contradiction, use the additional information. Output the recipe as a json so I can format it for the front end and save in a database.

        Current user information:
        - Ingredients: {user_ingredients}
        - Tools: {user_tools}
        - Budget: {user_budget}
        - Skill Level: {user_skill_level}

        User prompt:
        {prompt}
        """
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a recipe bot that creates tasty and realistic recipes. The user will give you a list of ingredients and you will generate a recipe using those ingredients. NOTE You do not have to use all the ingredients. Only the ones that makes sense. The user may give other restrictions such as budget for extrea ingredients or dietary restrictions. If there is a good recipe, but the user does not have the ingredients, you can use it if it is in budget. The user will also give cook time and skill level. Format the recipel like a recipe youd find on the internet. Also generate the nutrition facts for number of servings and nutritions for serving"},
                {"role": "user", "content": complete_prompt}
            ]
        )

        generated_text = response.choices[0].message.content
        print(generated_text)

        if not generated_text:
            return JsonResponse({'error': 'Failed to generate a valid response from OpenAI'}, status=500)

        return JsonResponse({'response': generated_text}, status=200)

    except openai.error.OpenAIError as e:
        print("OpenAI Error:", e)
        print(traceback.format_exc())
        return JsonResponse({'error': f"OpenAI API error: {str(e)}"}, status=500)
    except Exception as e:
        print("Internal Server Error:", e)
        print(traceback.format_exc())
        return JsonResponse({'error': f"Internal server error: {str(e)}"}, status=500)
