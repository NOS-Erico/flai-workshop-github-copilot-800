import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;
    console.log('Fetching activities from:', apiUrl);
    
    fetch(apiUrl)
      .then(response => {
        console.log('Activities API response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Activities data received:', data);
        // Handle both paginated (.results) and plain array responses
        const activitiesData = data.results || data;
        console.log('Processed activities data:', activitiesData);
        setActivities(activitiesData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching activities:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container mt-4"><p>Loading activities...</p></div>;
  if (error) return <div className="container mt-4"><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container mt-4">
      <h2>Activities</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>User</th>
              <th>Activity Type</th>
              <th>Duration (min)</th>
              <th>Distance (km)</th>
              <th>Calories Burned</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <tr key={activity.id || index}>
                  <td>{activity.user_name || activity.user || 'N/A'}</td>
                  <td>{activity.activity_type || 'N/A'}</td>
                  <td>{activity.duration || 0}</td>
                  <td>{activity.distance || 0}</td>
                  <td>{activity.calories_burned || 0}</td>
                  <td>{activity.date || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No activities found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Activities;
