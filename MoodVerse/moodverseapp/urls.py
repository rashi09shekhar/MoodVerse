
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import (
    MoodViewSet,
    JournalViewSet,
    RegisterView,
    LoginView,
    LogoutView
)

router = DefaultRouter()

router.register('moods', views.MoodViewSet, basename='mood')
router.register('journals', views.JournalViewSet, basename='journal')

urlpatterns = [
    path('mood-boost/', views.mood_boost, name='mood_boost'),

    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),

    path('', include(router.urls)),
]
