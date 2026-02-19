import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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

  if (loading) return (
    <div className="container mt-5">
      <div className="text-center spinner-container">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading activities...</span>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mt-5">
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error Loading Activities</h4>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="container mt-5">
      <div className="component-container">
        <h1 className="page-header">🏃 Activities</h1>
        <div className="mb-3">
          <span className="badge bg-primary">{activities.length} Total Activities</span>
        </div>
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
                    <td><strong>{activity.user_name || activity.user || activity.user_id || 'N/A'}</strong></td>
                    <td><span className="badge bg-info">{activity.activity_type || 'N/A'}</span></td>
                    <td>{activity.duration || 0}</td>
                    <td>{activity.distance || 0}</td>
                    <td><span className="badge bg-success">{activity.calories || activity.calories_burned || 0} cal</span></td>
                    <td>{formatDate(activity.date)}</td>
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
    </div>
  );
}

export default Activities;
