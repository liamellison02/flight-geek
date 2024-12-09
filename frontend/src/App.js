import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import FlightSearch from './components/FlightSearch';
import CreateTracker from './components/CreateTracker';
import DashboardLayout from './components/DashboardLayout';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<DashboardLayout />} />
            <Route path="/search-flights" element={<FlightSearch />} />
            <Route path="/create-tracker" element={<CreateTracker />} />
        </Routes>
    );
};

export default App;