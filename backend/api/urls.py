from django.urls import path, include
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('profiles/', views.ProfileListCreate.as_view(), name='profile_list'),
    path('profiles/delete/<int:pk>/', views.ProfileDelete.as_view(), name='profile_delete'),
    path('recipes/', views.RecipeListCreate.as_view(), name='recipe_list'),
    path('recipes/delete/<int:pk>/', views.RecipeDelete.as_view(), name='recipe_delete'),
]
