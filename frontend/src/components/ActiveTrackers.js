import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { Home, Search, PlaneTakeoff } from 'lucide-react';
import axios from 'axios';

const ActiveTrackers = () => {
    const { user } = useContext(UserContext); 
    const [trackedFlights, setTrackedFlights] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user && user.id) {
            fetchTrackedFlights(user.id);
        }
    }, [user]);

    const fetchTrackedFlights = async (userId) => {
        setIsLoading(true);
        setError('');
        try {
            const response = await axios.get(`http://localhost:5000/trackers?user_id=${userId}`);
            setTrackedFlights(response.data);
        } catch (error) {
            setError('Failed to retrieve tracked flights.');
            console.error('Error fetching tracked flights:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#001524] to-[#003355]">
            {/* Navigation Bar */}
            <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <img 
                                src="/logo.jpeg" 
                                alt="Flight Geek Logo" 
                                className="h-8 w-8 mr-2"
                            />
                            <span className="text-white font-semibold">Flight Geek</span>
                        </div>
                        <div className="flex space-x-4">
                            <Link
                                to="/"
                                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-[#40E0FF]/10 hover:bg-[#40E0FF]/20 transition-colors"
                            >
                                <Home className="h-4 w-4 mr-2" />
                                Home
                            </Link>
                            <Link
                                to="/search-flights"
                                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-[#40E0FF]/10 hover:bg-[#40E0FF]/20 transition-colors"
                            >
                                <Search className="h-4 w-4 mr-2" />
                                Search Flights
                            </Link>
                            <Link
                                to="/active-trackers"
                                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-[#40E0FF]/10 hover:bg-[#40E0FF]/20 transition-colors"
                            >
                                <PlaneTakeoff className="h-4 w-4 mr-2" />
                                Active Trackers
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="px-4 py-8">
                <h1 className="text-3xl font-bold text-white text-center mb-6">Active Flight Trackers</h1>

                {isLoading && <p className="text-center text-white">Loading tracked flights...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {!isLoading && trackedFlights.length === 0 && !error && (
                    <p className="text-center text-gray-400">No active trackers found.</p>
                )}

                <div className="max-w-4xl mx-auto">
                    {trackedFlights.map((flight) => (
                        <div 
                            key={flight.flight_id}
                            className="flex items-center justify-between p-6 mb-4 rounded-lg bg-black/20 border border-[#40E0FF]/10 hover:border-[#40E0FF]/30 transition"
                        >
                            {/* Flight Details */}
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-full bg-[#40E0FF]/10">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#40E0FF" className="h-6 w-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75a3 3 0 0 1 6 0M3 9.75h5.75a.25.25 0 0 0 .25-.25V3m-6 6.75A3.001 3.001 0 0 0 6 12m0 0h12m0 0a3.001 3.001 0 0 0 3-3.25M6 12v5.5a3.001 3.001 0 0 0 2.25 2.916m5.75-8.416V6m-2.5 6.75H6m2.5-2.5H21m0 0a3.001 3.001 0 0 1-3.25-2.5m3.25 2.5H6m2.5-3V9m0 0V6m0 0h6m-6 3.25a3.001 3.001 0 0 1 3 2.5M21 9.75h-6.75m6.75 0V6" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg text-white font-medium">
                                        Flight {flight.flight_number}
                                    </h3>
                                    <p className="text-gray-400">
                                        {flight.origin} → {flight.destination}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Departure: {new Date(flight.departure_time).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Price Details */}
                            <div className="text-right">
                                <p className="text-[#40E0FF] font-medium">
                                    Current Price: ${flight.current_price || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-400">
                                    Lowest Price: ${flight.lowest_price || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-400">
                                    Last Updated: {flight.price_history.length > 0
                                        ? new Date(flight.price_history[0].timestamp).toLocaleString()
                                        : 'N/A'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ActiveTrackers;
