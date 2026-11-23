
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token

from .models import Mood, Journal
from .serializers import (
    MoodSerializer,
    JournalSerializer,
    RegisterSerializer
)


# MOOD API
class MoodViewSet(viewsets.ModelViewSet):

    serializer_class = MoodSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Mood.objects.filter(
            user=self.request.user
        ).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# JOURNAL API
class JournalViewSet(viewsets.ModelViewSet):

    serializer_class = JournalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Journal.objects.filter(
            user=self.request.user
        ).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# USER REGISTRATION API
class RegisterView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            token, created = Token.objects.get_or_create(
                user=user
            )

            return Response({
                'message': 'Registration successful!',
                'username': user.username,
                'token': token.key
            }, status=status.HTTP_201_CREATED)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


# USER LOGIN API
class LoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        identifier = (
            request.data.get('email')
            or request.data.get('username')
            or ''
        ).strip()

        password = request.data.get('password', '')

        users = User.objects.filter(
            email__iexact=identifier
        )

        if users.count() == 1:
            username = users.first().username
        else:
            username = identifier

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user is not None:

            token, created = Token.objects.get_or_create(
                user=user
            )

            return Response({
                'message': 'Login successful!',
                'username': user.username,
                'token': token.key
            }, status=status.HTTP_200_OK)

        return Response({
            'error': 'Invalid email/username or password'
        }, status=status.HTTP_400_BAD_REQUEST)


# USER LOGOUT API
class LogoutView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        request.auth.delete()

        return Response({
            'message': 'Logout successful!'
        }, status=status.HTTP_200_OK)


from django.shortcuts import render

def mood_boost(request):
    return render(request, 'mood-boost.html')