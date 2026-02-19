from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from .models import User, Team, Activity, Leaderboard, Workout
from datetime import datetime


class UserModelTest(TestCase):
    """Test cases for User model"""
    
    def setUp(self):
        self.user = User.objects.create(
            email='test@example.com',
            name='Test User'
        )
    
    def test_user_creation(self):
        """Test that a user can be created"""
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertEqual(self.user.name, 'Test User')
        self.assertIsNotNone(self.user._id)
    
    def test_user_str(self):
        """Test user string representation"""
        self.assertEqual(str(self.user), 'Test User')


class TeamModelTest(TestCase):
    """Test cases for Team model"""
    
    def setUp(self):
        self.team = Team.objects.create(
            name='Test Team',
            description='A test team'
        )
    
    def test_team_creation(self):
        """Test that a team can be created"""
        self.assertEqual(self.team.name, 'Test Team')
        self.assertEqual(self.team.description, 'A test team')
        self.assertIsNotNone(self.team._id)
    
    def test_team_str(self):
        """Test team string representation"""
        self.assertEqual(str(self.team), 'Test Team')


class ActivityModelTest(TestCase):
    """Test cases for Activity model"""
    
    def setUp(self):
        self.activity = Activity.objects.create(
            user_id='test_user_123',
            activity_type='running',
            duration=30,
            calories=300,
            date=datetime.now(),
            notes='Morning run'
        )
    
    def test_activity_creation(self):
        """Test that an activity can be created"""
        self.assertEqual(self.activity.activity_type, 'running')
        self.assertEqual(self.activity.duration, 30)
        self.assertEqual(self.activity.calories, 300)
        self.assertIsNotNone(self.activity._id)


class LeaderboardModelTest(TestCase):
    """Test cases for Leaderboard model"""
    
    def setUp(self):
        self.leaderboard_entry = Leaderboard.objects.create(
            user_id='test_user_123',
            user_name='Test User',
            total_calories=1000,
            total_activities=10,
            rank=1
        )
    
    def test_leaderboard_creation(self):
        """Test that a leaderboard entry can be created"""
        self.assertEqual(self.leaderboard_entry.user_name, 'Test User')
        self.assertEqual(self.leaderboard_entry.total_calories, 1000)
        self.assertEqual(self.leaderboard_entry.rank, 1)
        self.assertIsNotNone(self.leaderboard_entry._id)


class WorkoutModelTest(TestCase):
    """Test cases for Workout model"""
    
    def setUp(self):
        self.workout = Workout.objects.create(
            name='Beginner Cardio',
            description='A beginner-friendly cardio workout',
            difficulty='beginner',
            duration=20,
            calories_estimate=150,
            exercises=['jumping jacks', 'high knees', 'burpees']
        )
    
    def test_workout_creation(self):
        """Test that a workout can be created"""
        self.assertEqual(self.workout.name, 'Beginner Cardio')
        self.assertEqual(self.workout.difficulty, 'beginner')
        self.assertEqual(self.workout.duration, 20)
        self.assertIsNotNone(self.workout._id)


class APIEndpointTests(APITestCase):
    """Test cases for API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
    
    def test_api_root(self):
        """Test that API root endpoint returns links"""
        url = reverse('api-root')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('users', response.data)
        self.assertIn('teams', response.data)
        self.assertIn('activities', response.data)
        self.assertIn('leaderboard', response.data)
        self.assertIn('workouts', response.data)
    
    def test_user_list_endpoint(self):
        """Test that user list endpoint is accessible"""
        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_team_list_endpoint(self):
        """Test that team list endpoint is accessible"""
        url = reverse('team-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_activity_list_endpoint(self):
        """Test that activity list endpoint is accessible"""
        url = reverse('activity-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_leaderboard_list_endpoint(self):
        """Test that leaderboard list endpoint is accessible"""
        url = reverse('leaderboard-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_workout_list_endpoint(self):
        """Test that workout list endpoint is accessible"""
        url = reverse('workout-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
