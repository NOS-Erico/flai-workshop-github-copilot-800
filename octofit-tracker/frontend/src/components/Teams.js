import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;
    console.log('Fetching teams from:', apiUrl);
    
    fetch(apiUrl)
      .then(response => {
        console.log('Teams API response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Teams data received:', data);
        // Handle both paginated (.results) and plain array responses
        const teamsData = data.results || data;
        console.log('Processed teams data:', teamsData);
        setTeams(teamsData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching teams:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container mt-4"><p>Loading teams...</p></div>;
  if (error) return <div className="container mt-4"><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container mt-4">
      <h2>Teams</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Team Name</th>
              <th>Description</th>
              <th>Created Date</th>
              <th>Members Count</th>
            </tr>
          </thead>
          <tbody>
            {teams.length > 0 ? (
              teams.map((team, index) => (
                <tr key={team.id || index}>
                  <td>{team.name || 'N/A'}</td>
                  <td>{team.description || 'N/A'}</td>
                  <td>{team.created_at || team.created || 'N/A'}</td>
                  <td>{team.members_count || team.members?.length || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No teams found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Teams;
