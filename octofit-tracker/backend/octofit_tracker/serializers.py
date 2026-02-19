from rest_framework import serializers
from bson import ObjectId
from .models import User, Team, Activity, Leaderboard, Workout


class UserSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()
    date_joined = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'username', 'first_name', 'last_name', 'team_id', 'created_at', 'date_joined']
    
    def get_id(self, obj):
        return str(obj._id) if obj._id else None
    
    def get_username(self, obj):
        # Use email as username or extract from email
        return obj.email.split('@')[0] if obj.email else None
    
    def get_first_name(self, obj):
        # Split name into first and last name
        if obj.name:
            parts = obj.name.split(' ', 1)
            return parts[0]
        return None
    
    def get_last_name(self, obj):
        # Split name into first and last name
        if obj.name:
            parts = obj.name.split(' ', 1)
            return parts[1] if len(parts) > 1 else ''
        return None
    
    def get_date_joined(self, obj):
        return obj.created_at


class TeamSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    members_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'created_at', 'members_count']
    
    def get_id(self, obj):
        return str(obj._id) if obj._id else None
    
    def get_members_count(self, obj):
        # Count users who belong to this team
        return User.objects.filter(team_id=str(obj._id)).count()


class ActivitySerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Activity
        fields = ['id', 'user_id', 'user_name', 'activity_type', 'duration', 'calories', 'date', 'notes']
    
    def get_id(self, obj):
        return str(obj._id) if obj._id else None
    
    def get_user_name(self, obj):
        try:
            user = User.objects.get(_id=ObjectId(obj.user_id))
            return user.name
        except User.DoesNotExist:
            return 'Unknown User'


class LeaderboardSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    
    class Meta:
        model = Leaderboard
        fields = ['id', 'user_id', 'user_name', 'team_id', 'team_name', 'total_calories', 'total_activities', 'rank']
    
    def get_id(self, obj):
        return str(obj._id) if obj._id else None


class WorkoutSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    
    class Meta:
        model = Workout
        fields = ['id', 'name', 'description', 'difficulty', 'duration', 'calories_estimate', 'exercises']
    
    def get_id(self, obj):
        return str(obj._id) if obj._id else None
