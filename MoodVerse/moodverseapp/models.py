
from django.db import models
from django.contrib.auth.models import User


class Mood(models.Model):

    MOOD_CHOICES = [
        ('Happy', 'Happy'),
        ('Sad', 'Sad'),
        ('Angry', 'Angry'),
        ('Anxious', 'Anxious'),
        ('Calm', 'Calm'),
        ('Excited', 'Excited'),
        ('Tired', 'Tired'),
        ('Neutral', 'Neutral'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='moods'
    )

    mood = models.CharField(
        max_length=20,
        choices=MOOD_CHOICES
    )

    note = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.mood}"


class Journal(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='journals'
    )

    title = models.CharField(max_length=200)

    content = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
