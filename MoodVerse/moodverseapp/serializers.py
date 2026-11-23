
from rest_framework import serializers
from .models import Mood, Journal


class MoodSerializer(serializers.ModelSerializer):

    class Meta:
        model = Mood
        fields = [
            'id',
            'mood',
            'note',
            'created_at'
        ]

        read_only_fields = ['id', 'created_at']


class JournalSerializer(serializers.ModelSerializer):

    class Meta:
        model = Journal
        fields = [
            'id',
            'title',
            'content',
            'created_at',
            'updated_at'
        ]

        read_only_fields = [
            'id',
            'created_at',
            'updated_at'
        ]

from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        validators=[validate_password]
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user
