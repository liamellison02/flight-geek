import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Home, Search, PlaneTakeoff, AlertCircle, Plane } from 'lucide-react';

const ActiveTrackers = () => {
    const [userId, setUserId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [trackedFlights, setTrackedFlights] = useState([]);

    // Demo data structure for tracked flights
    const demoTrackedFlights = [
        {
            id: 1,
            flight_number: 'DL66',
            origin: 'ATL',
            destination: 'FCO',
            departure_time: '2024-12-08T19:24:00',
            current_price: 850,
            price_history: [
                { price: 900, timestamp: '2024-12-07T19:24:00' },
                { price: 850, timestamp: '2024-12-08T19:24:00' }
            ]
        }
    ];

    const handleRetrieveFlights = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // For MVP demo, just set demo data
            setTrackedFlights(demoTrackedFlights);
            setMessage('Flights retrieved successfully');
        } catch (error) {
            setMessage('Failed to retrieve tracked flights');
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
                                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-[#40E0FF]/30 hover:bg-[#40E0FF]/40 transition-colors"
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
                {/* Header Section */}
                <div className="max-w-xl mx-auto text-center mb-12">
                    <img 
                        src="/logo.jpeg" 
                        alt="Flight Geek Logo" 
                        className="w-20 h-20 mx-auto mb-6"
                    />
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Active Flight Trackers
                    </h1>
                    <p className="text-[#40E0FF] text-lg">
                        Enter your information to see your active trackers
                    </p>
                </div>

                {/* Form Section */}
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/10">
                        <form onSubmit={handleRetrieveFlights} className="space-y-6">
                            <div>
                                <label htmlFor="userId" className="block text-sm font-medium text-[#40E0FF] mb-1">
                                    User ID
                                </label>
                                <input
                                    id="userId"
                                    type="text"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-[#40E0FF]/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#40E0FF]/50 transition"
                                    placeholder="Enter your user ID"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full px-6 py-3 rounded-lg bg-[#40E0FF] text-[#001524] font-semibold hover:bg-[#40E0FF]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <PlaneTakeoff className="h-5 w-5" />
                                {isLoading ? 'Retrieving...' : 'Retrieve Flights'}
                            </button>
                        </form>

                        {/* Quick Tips */}
                        <div className="mt-8 p-4 rounded-lg bg-[#40E0FF]/5 border border-[#40E0FF]/10">
                            <h3 className="text-[#40E0FF] font-medium mb-2 flex items-center gap-2">
                                <AlertCircle className="h-5 w-5" />
                                Quick Tips
                            </h3>
                            <ul className="text-gray-300 text-sm space-y-1">
                                <li>• User ID is the same as your login email</li>
                                <li>• Prices will be tracked every hour, you will see updates on this screen</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Tracked Flights Display */}
                {trackedFlights.length > 0 && (
                    <div className="max-w-4xl mx-auto mt-8">
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-lg border border-white/10">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-white mb-6">Tracked Flights</h2>
                                <div className="space-y-4">
                                    {trackedFlights.map((flight) => (
                                        <div 
                                            key={flight.id}
                                            className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-[#40E0FF]/10 hover:border-[#40E0FF]/30 transition"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 rounded-full bg-[#40E0FF]/10">
                                                    <Plane className="h-6 w-6 text-[#40E0FF]" />
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-medium">
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
                                            <div className="text-right">
                                                <p className="text-[#40E0FF] font-medium">
                                                    Current Price: ${flight.current_price}
                                                </p>
                                                <p className="text-sm text-gray-400">
                                                    Last updated: {new Date(flight.price_history[0].timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActiveTrackers;