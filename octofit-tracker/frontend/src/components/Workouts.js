import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;
    console.log('Fetching workouts from:', apiUrl);
    
    fetch(apiUrl)
      .then(response => {
        console.log('Workouts API response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Workouts data received:', data);
        // Handle both paginated (.results) and plain array responses
        const workoutsData = data.results || data;
        console.log('Processed workouts data:', workoutsData);
        setWorkouts(workoutsData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching workouts:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="container mt-5">
      <div className="text-center spinner-container">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading workouts...</span>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mt-5">
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error Loading Workouts</h4>
        <p>{error}</p>
      </div>
    </div>
  );

  const getDifficultyBadge = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return 'bg-success';
      case 'medium': return 'bg-warning text-dark';
      case 'hard': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="container mt-5">
      <div className="component-container">
        <h1 className="page-header">💪 Workouts</h1>
        <div className="mb-3">
          <span className="badge bg-primary">{workouts.length} Available Workouts</span>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Workout Name</th>
                <th>Description</th>
                <th>Activity Type</th>
                <th>Duration (min)</th>
                <th>Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {workouts.length > 0 ? (
                workouts.map((workout, index) => (
                  <tr key={workout.id || index}>
                    <td><strong>{workout.name || 'N/A'}</strong></td>
                    <td>{workout.description || 'N/A'}</td>
                    <td><span className="badge bg-info">{workout.activity_type || 'N/A'}</span></td>
                    <td>{workout.duration || 0}</td>
                    <td><span className={`badge ${getDifficultyBadge(workout.difficulty)}`}>{workout.difficulty || 'N/A'}</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No workouts found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Workouts;
