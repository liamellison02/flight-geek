import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import FlightSearch from './components/FlightSearch';
import CreateTracker from './components/CreateTracker';
import DashboardLayout from './components/DashboardLayout';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Home/Login/Signup page */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                
                {/* Dashboard with tabs */}
                <Route path="/dashboard" element={<DashboardLayout />} />
                
                {/* Keeping existing routes for compatibility */}
                <Route path="/search-flights" element={<FlightSearch />} />
                <Route path="/create-tracker" element={<CreateTracker />} />
            </Routes>
        </Router>
    );
};

export default App;