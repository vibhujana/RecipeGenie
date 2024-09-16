from django.urls import path, include
from .views import generate_prompt, CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('generate/', generate_prompt, name='generate_prompt'),
    path('user/register/', CreateUserView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='get_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
    path('auth/', include('rest_framework.urls', namespace='rest_framework')),
]
