import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import FlightSearch from './components/FlightSearch';
import CreateTracker from './components/CreateTracker';

const App = () => {
    return (
        <Router>
            {/* <div>
                <h1>Flight Tracker App</h1> */}
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search-flights" element={<FlightSearch />} />
                    <Route path="/create-tracker" element={<CreateTracker />} />
                </Routes>
            {/* </div> */}
        </Router>
    );
};

export default App;