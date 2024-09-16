from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

# serializer: python object <-> json


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True, 'required': True}, 'email': {'required': True, 'validators': [UniqueValidator(queryset=User.objects.all())]}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user