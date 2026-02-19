import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;
    console.log('Fetching leaderboard from:', apiUrl);
    
    fetch(apiUrl)
      .then(response => {
        console.log('Leaderboard API response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Leaderboard data received:', data);
        // Handle both paginated (.results) and plain array responses
        const leaderboardData = data.results || data;
        console.log('Processed leaderboard data:', leaderboardData);
        setLeaderboard(leaderboardData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching leaderboard:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="container mt-5">
      <div className="text-center spinner-container">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading leaderboard...</span>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mt-5">
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error Loading Leaderboard</h4>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="container mt-5">
      <div className="component-container">
        <h1 className="page-header">🏆 Leaderboard</h1>
        <div className="mb-3">
          <span className="badge bg-warning text-dark">{leaderboard.length} Competitors</span>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Total Points</th>
                <th>Total Activities</th>
                <th>Total Calories</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length > 0 ? (
                leaderboard.map((entry, index) => {
                  let rankBadge = 'bg-secondary';
                  let rankIcon = '';
                  if (index === 0) { rankBadge = 'bg-warning text-dark'; rankIcon = '🥇 '; }
                  else if (index === 1) { rankBadge = 'bg-secondary'; rankIcon = '🥈 '; }
                  else if (index === 2) { rankBadge = 'bg-danger'; rankIcon = '🥉 '; }
                  
                  return (
                    <tr key={entry.id || index}>
                      <td><span className={`badge ${rankBadge}`}>{rankIcon}{index + 1}</span></td>
                      <td><strong>{entry.user_name || entry.username || entry.user || 'N/A'}</strong></td>
                      <td><span className="badge bg-primary">{entry.total_points || entry.points || 0} pts</span></td>
                      <td>{entry.total_activities || entry.activities || 0}</td>
                      <td><span className="badge bg-success">{entry.total_calories || entry.calories || 0} cal</span></td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No leaderboard data found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
