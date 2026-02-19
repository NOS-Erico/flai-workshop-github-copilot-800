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

  if (loading) return <div className="container mt-4"><p>Loading leaderboard...</p></div>;
  if (error) return <div className="container mt-4"><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container mt-4">
      <h2>Leaderboard</h2>
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
              leaderboard.map((entry, index) => (
                <tr key={entry.id || index}>
                  <td>{index + 1}</td>
                  <td>{entry.user_name || entry.username || entry.user || 'N/A'}</td>
                  <td>{entry.total_points || entry.points || 0}</td>
                  <td>{entry.total_activities || entry.activities || 0}</td>
                  <td>{entry.total_calories || entry.calories || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No leaderboard data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
