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

  if (loading) return (
    <div className="container mt-5">
      <div className="text-center spinner-container">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading teams...</span>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mt-5">
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error Loading Teams</h4>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="container mt-5">
      <div className="component-container">
        <h1 className="page-header">👥 Teams</h1>
        <div className="mb-3">
          <span className="badge bg-primary">{teams.length} Active Teams</span>
        </div>
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
                    <td><strong>{team.name || 'N/A'}</strong></td>
                    <td>{team.description || 'N/A'}</td>
                    <td>{team.created_at ? new Date(team.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</td>
                    <td><span className="badge bg-info">{team.members_count || 0} members</span></td>
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
    </div>
  );
}

export default Teams;
