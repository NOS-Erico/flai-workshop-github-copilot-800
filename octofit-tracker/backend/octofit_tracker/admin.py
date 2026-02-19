from django.contrib import admin
from .models import User, Team, Activity, Leaderboard, Workout


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['_id', 'email', 'name', 'team_id', 'created_at']
    list_filter = ['created_at', 'team_id']
    search_fields = ['email', 'name']
    ordering = ['-created_at']


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['_id', 'name', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'description']
    ordering = ['-created_at']


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['_id', 'user_id', 'activity_type', 'duration', 'calories', 'date']
    list_filter = ['activity_type', 'date']
    search_fields = ['user_id', 'activity_type']
    ordering = ['-date']


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ['_id', 'user_name', 'team_name', 'total_calories', 'total_activities', 'rank']
    list_filter = ['team_name', 'rank']
    search_fields = ['user_name', 'team_name']
    ordering = ['rank']


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ['_id', 'name', 'difficulty', 'duration', 'calories_estimate']
    list_filter = ['difficulty']
    search_fields = ['name', 'description']
    ordering = ['difficulty', 'name']
