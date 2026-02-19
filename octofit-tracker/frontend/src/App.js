import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';
import logo from './octofitapp-small.png';

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
            <img src={logo} alt="OctoFit Logo" className="navbar-logo" />
            OctoFit Tracker
          
          <Link className="navbar-brand" to="/">OctoFit Tracker</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/users">Users</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/activities">Activities</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/teams">Teams</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/leaderboard">Leaderboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/workouts">Workouts</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div style={{ minHeight: 'calc(100vh - 56px)' }}>
        <Routes>
          <Route path="/" element={
            <div className="container mt-5">
              <div className="jumbotron">
                <h1 className="display-4">🏋️ Welcome to OctoFit Tracker!</h1>
                <p className="lead">Track your fitness journey, compete with teams, and achieve your goals.</p>
                <hr className="my-4" />
                <p>Navigate through the menu to explore activities, teams, leaderboard, and more.</p>
                <div className="mt-4">
                  <Link to="/activities" className="btn btn-primary btn-lg me-2">View Activities</Link>
                  <Link to="/leaderboard" className="btn btn-outline-primary btn-lg">Leaderboard</Link>
                </div>
              </div>
            </div>
          } />
          <Route path="/users" element={<Users />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
