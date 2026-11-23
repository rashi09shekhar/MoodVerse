from django.contrib import admin

from django.contrib import admin
from .models import Mood, Journal


@admin.register(Mood)
class MoodAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'mood', 'created_at')
    list_filter = ('mood', 'created_at')
    search_fields = ('user__username', 'note')


@admin.register(Journal)
class JournalAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'title', 'created_at')
    search_fields = ('user__username', 'title', 'content')

# Register your models here.
