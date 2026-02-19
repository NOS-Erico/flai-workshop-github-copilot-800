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

  if (loading) return <div className="container mt-4"><p>Loading workouts...</p></div>;
  if (error) return <div className="container mt-4"><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container mt-4">
      <h2>Workouts</h2>
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
                  <td>{workout.name || 'N/A'}</td>
                  <td>{workout.description || 'N/A'}</td>
                  <td>{workout.activity_type || 'N/A'}</td>
                  <td>{workout.duration || 0}</td>
                  <td>{workout.difficulty || 'N/A'}</td>
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
  );
}

export default Workouts;
