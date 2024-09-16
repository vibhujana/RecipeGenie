from django.urls import path, include
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('generate/', views.generate_prompt, name='generate_prompt'),
    path('profiles/', views.ProfileListCreate.as_view(), name='profile_list'),
    path('profiles/delete/<int:pk>/', views.ProfileDelete.as_view(), name='profile_delete'),
]
