from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from .models import User, Team, Activity, Leaderboard, Workout
from .serializers import (
    UserSerializer, 
    TeamSerializer, 
    ActivitySerializer, 
    LeaderboardSerializer, 
    WorkoutSerializer
)


@api_view(['GET'])
def api_root(request, format=None):
    """
    API root endpoint that provides links to all available endpoints
    """
    return Response({
        'users': reverse('user-list', request=request, format=format),
        'teams': reverse('team-list', request=request, format=format),
        'activities': reverse('activity-list', request=request, format=format),
        'leaderboard': reverse('leaderboard-list', request=request, format=format),
        'workouts': reverse('workout-list', request=request, format=format),
    })


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing users
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    @action(detail=True, methods=['get'])
    def activities(self, request, pk=None):
        """Get all activities for a specific user"""
        user_activities = Activity.objects.filter(user_id=str(pk))
        serializer = ActivitySerializer(user_activities, many=True)
        return Response(serializer.data)


class TeamViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing teams
    """
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    
    @action(detail=True, methods=['get'])
    def members(self, request, pk=None):
        """Get all members of a specific team"""
        team_members = User.objects.filter(team_id=str(pk))
        serializer = UserSerializer(team_members, many=True)
        return Response(serializer.data)


class ActivityViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing activities
    """
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    
    def get_queryset(self):
        """
        Optionally restricts the returned activities to a given user,
        by filtering against a `user_id` query parameter in the URL.
        """
        queryset = Activity.objects.all()
        user_id = self.request.query_params.get('user_id', None)
        if user_id is not None:
            queryset = queryset.filter(user_id=user_id)
        return queryset


class LeaderboardViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing leaderboard
    """
    queryset = Leaderboard.objects.all().order_by('rank')
    serializer_class = LeaderboardSerializer
    
    @action(detail=False, methods=['get'])
    def top_users(self, request):
        """Get top 10 users by total calories"""
        top_users = Leaderboard.objects.all().order_by('-total_calories')[:10]
        serializer = self.get_serializer(top_users, many=True)
        return Response(serializer.data)


class WorkoutViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing workouts
    """
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
    
    def get_queryset(self):
        """
        Optionally restricts the returned workouts to a given difficulty level,
        by filtering against a `difficulty` query parameter in the URL.
        """
        queryset = Workout.objects.all()
        difficulty = self.request.query_params.get('difficulty', None)
        if difficulty is not None:
            queryset = queryset.filter(difficulty=difficulty)
        return queryset
    
    @action(detail=False, methods=['get'])
    def by_difficulty(self, request):
        """Get workouts grouped by difficulty"""
        beginner = Workout.objects.filter(difficulty='beginner')
        intermediate = Workout.objects.filter(difficulty='intermediate')
        advanced = Workout.objects.filter(difficulty='advanced')
        
        return Response({
            'beginner': WorkoutSerializer(beginner, many=True).data,
            'intermediate': WorkoutSerializer(intermediate, many=True).data,
            'advanced': WorkoutSerializer(advanced, many=True).data,
        })
