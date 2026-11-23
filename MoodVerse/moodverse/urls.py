from django.contrib import admin
from django.urls import path, include
from django.shortcuts import render

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('moodverseapp.urls')),

    path('', lambda request: render(request, 'index.html')),
    path('home/', lambda request: render(request, 'home.html')),
    path('login/', lambda request: render(request, 'login.html')),
    path('register/', lambda request: render(request, 'register.html')),
    path('dashboard/', lambda request: render(request, 'dashboard.html')),
    path('journal/', lambda request: render(request, 'journal.html')),
    path('achievements/', lambda request: render(request, 'achievements.html')),
    path('analytics/', lambda request: render(request, 'analytics.html')),
    path('breathing/', lambda request: render(request, 'breathing.html')),
    path('mood/', lambda request: render(request, 'mood.html')),
    path('mood-check/', lambda request: render(request, 'mood-check.html')),
    path('mood-boost/', lambda request: render(request, 'mood-boost.html')),
    path('pop-stress/', lambda request: render(request, 'pop-stress.html')),
    path('success/', lambda request: render(request, 'success.html')),
]