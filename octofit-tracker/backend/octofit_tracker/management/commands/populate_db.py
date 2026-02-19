from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        self.stdout.write('Clearing existing data...')
        
        # Delete all existing data using Django ORM
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()
        
        self.stdout.write('Creating teams...')
        
        # Create teams
        team_marvel = Team.objects.create(
            name='Team Marvel',
            description='Earth\'s Mightiest Heroes fighting for fitness!'
        )
        
        team_dc = Team.objects.create(
            name='Team DC',
            description='Justice League members staying in peak condition!'
        )
        
        self.stdout.write('Creating users...')
        
        # Create Marvel users
        marvel_users = [
            {'email': 'tony.stark@avengers.com', 'name': 'Tony Stark'},
            {'email': 'steve.rogers@avengers.com', 'name': 'Steve Rogers'},
            {'email': 'natasha.romanoff@avengers.com', 'name': 'Natasha Romanoff'},
            {'email': 'thor.odinson@avengers.com', 'name': 'Thor Odinson'},
            {'email': 'bruce.banner@avengers.com', 'name': 'Bruce Banner'},
        ]
        
        # Create DC users
        dc_users = [
            {'email': 'bruce.wayne@justiceleague.com', 'name': 'Bruce Wayne'},
            {'email': 'clark.kent@justiceleague.com', 'name': 'Clark Kent'},
            {'email': 'diana.prince@justiceleague.com', 'name': 'Diana Prince'},
            {'email': 'barry.allen@justiceleague.com', 'name': 'Barry Allen'},
            {'email': 'arthur.curry@justiceleague.com', 'name': 'Arthur Curry'},
        ]
        
        created_users = []
        
        for user_data in marvel_users:
            user = User.objects.create(
                email=user_data['email'],
                name=user_data['name'],
                team_id=str(team_marvel._id)
            )
            created_users.append(user)
        
        for user_data in dc_users:
            user = User.objects.create(
                email=user_data['email'],
                name=user_data['name'],
                team_id=str(team_dc._id)
            )
            created_users.append(user)
        
        self.stdout.write('Creating activities...')
        
        # Activity types
        activity_types = ['Running', 'Cycling', 'Swimming', 'Weight Training', 'Yoga', 'Boxing', 'HIIT']
        
        # Create random activities for each user
        for user in created_users:
            num_activities = random.randint(3, 8)
            for i in range(num_activities):
                activity_type = random.choice(activity_types)
                duration = random.randint(20, 90)
                calories = duration * random.randint(8, 15)
                days_ago = random.randint(0, 30)
                
                Activity.objects.create(
                    user_id=str(user._id),
                    activity_type=activity_type,
                    duration=duration,
                    calories=calories,
                    date=datetime.now() - timedelta(days=days_ago),
                    notes=f'{activity_type} session by {user.name}'
                )
        
        self.stdout.write('Creating leaderboard entries...')
        
        # Calculate leaderboard data
        for idx, user in enumerate(created_users):
            activities = Activity.objects.filter(user_id=str(user._id))
            total_calories = sum(activity.calories for activity in activities)
            total_activities = activities.count()
            
            # Get team by filtering through users
            if user.team_id == str(team_marvel._id):
                team = team_marvel
            else:
                team = team_dc
            
            Leaderboard.objects.create(
                user_id=str(user._id),
                user_name=user.name,
                team_id=str(team._id),
                team_name=team.name,
                total_calories=total_calories,
                total_activities=total_activities,
                rank=0  # Will be calculated later
            )
        
        # Update ranks based on total calories
        leaderboard_entries = Leaderboard.objects.all().order_by('-total_calories')
        for rank, entry in enumerate(leaderboard_entries, start=1):
            entry.rank = rank
            entry.save()
        
        self.stdout.write('Creating workout suggestions...')
        
        # Create workout suggestions
        workouts = [
            {
                'name': 'Avenger HIIT',
                'description': 'High-intensity interval training inspired by superhero combat training',
                'difficulty': 'advanced',
                'duration': 45,
                'calories_estimate': 600,
                'exercises': [
                    {'name': 'Burpees', 'reps': 20},
                    {'name': 'Mountain Climbers', 'duration': '60 seconds'},
                    {'name': 'Jump Squats', 'reps': 15},
                    {'name': 'Push-ups', 'reps': 20},
                ]
            },
            {
                'name': 'Justice League Strength',
                'description': 'Build strength like the world\'s greatest heroes',
                'difficulty': 'intermediate',
                'duration': 60,
                'calories_estimate': 450,
                'exercises': [
                    {'name': 'Deadlifts', 'sets': 3, 'reps': 10},
                    {'name': 'Bench Press', 'sets': 3, 'reps': 10},
                    {'name': 'Squats', 'sets': 3, 'reps': 12},
                    {'name': 'Pull-ups', 'sets': 3, 'reps': 8},
                ]
            },
            {
                'name': 'Beginner Hero Training',
                'description': 'Start your superhero journey with this beginner-friendly workout',
                'difficulty': 'beginner',
                'duration': 30,
                'calories_estimate': 250,
                'exercises': [
                    {'name': 'Walking', 'duration': '10 minutes'},
                    {'name': 'Bodyweight Squats', 'reps': 15},
                    {'name': 'Wall Push-ups', 'reps': 10},
                    {'name': 'Plank', 'duration': '30 seconds'},
                ]
            },
            {
                'name': 'Speedster Cardio',
                'description': 'Fast-paced cardio workout for speed and endurance',
                'difficulty': 'intermediate',
                'duration': 40,
                'calories_estimate': 500,
                'exercises': [
                    {'name': 'Sprint Intervals', 'sets': 8, 'duration': '30 seconds'},
                    {'name': 'High Knees', 'duration': '60 seconds'},
                    {'name': 'Jumping Jacks', 'reps': 50},
                    {'name': 'Box Jumps', 'reps': 15},
                ]
            },
            {
                'name': 'Warrior Yoga Flow',
                'description': 'Flexibility and balance training for the modern warrior',
                'difficulty': 'beginner',
                'duration': 45,
                'calories_estimate': 200,
                'exercises': [
                    {'name': 'Sun Salutations', 'sets': 5},
                    {'name': 'Warrior Poses', 'duration': '5 minutes'},
                    {'name': 'Tree Pose', 'duration': '2 minutes per side'},
                    {'name': 'Downward Dog', 'duration': '3 minutes'},
                ]
            },
        ]
        
        for workout_data in workouts:
            Workout.objects.create(**workout_data)
        
        self.stdout.write(self.style.SUCCESS('Successfully populated the octofit_db database!'))
        self.stdout.write(f'Created {User.objects.count()} users')
        self.stdout.write(f'Created {Team.objects.count()} teams')
        self.stdout.write(f'Created {Activity.objects.count()} activities')
        self.stdout.write(f'Created {Leaderboard.objects.count()} leaderboard entries')
        self.stdout.write(f'Created {Workout.objects.count()} workout suggestions')
