import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import FlightSearch from './components/FlightSearch';
import ActiveTrackers from './components/ActiveTrackers';

const App = () => {
    return (
        <Router>
            {/* <div>
                <h1>Flight Tracker App</h1> */}
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search-flights" element={<FlightSearch />} />
                    <Route path="/active-trackers" element={<ActiveTrackers />} />
                </Routes>
            {/* </div> */}
        </Router>
    );
};

export default App;