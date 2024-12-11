import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserProvider from './contexts/UserContext';
import HomePage from './components/HomePage';
import FlightSearch from './components/FlightSearch';
import ActiveTrackers from './components/ActiveTrackers';

const App = () => {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search-flights" element={<FlightSearch />} />
                    <Route path="/active-trackers" element={<ActiveTrackers />} />
                </Routes>
            </Router>
        </UserProvider>
    );
};

export default App;
