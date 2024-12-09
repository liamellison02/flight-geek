import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Plane, Home, PlaneTakeoff } from 'lucide-react';

const FlightSearch = () => {
    const [flightNumber, setFlightNumber] = useState('');
    const [flights, setFlights] = useState([]);
    const [userId, setUserId] = useState(9);
    const [flightId, setFlightId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const response = await axios.get(`http://localhost:5000/flights?flight_number=${flightNumber}`);
            setFlights(response.data);
            if (response.data.length === 0) {
                setError('No flights found with this number.');
            }
        } catch (error) {
            console.error('Error fetching flights:', error);
            setError('Failed to fetch flight information. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateTracker = async (flightId) => {
        setIsLoading(true);
        setMessage('');
        setError('');
    
        try {
            const response = await axios.post('http://localhost:5000/trackers', { 
                user_id: userId, 
                flight_id: flightId // Use the passed flightId
            });
            setMessage(response.data.message || 'Tracker created successfully');
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to create tracker');
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
                                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-[#40E0FF]/30 hover:bg-[#40E0FF]/40 transition-colors"
                            >
                                <Search className="h-4 w-4 mr-2" />
                                Search Flights
                            </Link>
                            <Link
                                to="/create-tracker"
                                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-[#40E0FF]/10 hover:bg-[#40E0FF]/20 transition-colors"
                            >
                                <PlaneTakeoff className="h-4 w-4 mr-2" />
                                Create Tracker
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
                        Search Flights
                    </h1>
                    <p className="text-[#40E0FF] text-lg">
                        Enter a flight number to track prices
                    </p>
                </div>

                {/* Search Form */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/10">
                        <form onSubmit={handleSearch} className="relative">
                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-[#40E0FF]/50" />
                                    </div>
                                    <input
                                        type="text"
                                        value={flightNumber}
                                        onChange={(e) => setFlightNumber(e.target.value)}
                                        placeholder="Enter flight number (e.g., AA123)"
                                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/20 border border-[#40E0FF]/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#40E0FF]/50 transition"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading || !flightNumber}
                                    className="px-6 py-3 rounded-lg bg-[#40E0FF] text-[#001524] font-semibold hover:bg-[#40E0FF]/90 transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? 'Searching...' : 'Search'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="max-w-2xl mx-auto mb-8 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                        <p className="text-red-200 text-center">{error}</p>
                    </div>
                )}

                {/* Results Section */}
                {flights.length > 0 && (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-lg border border-white/10">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-white mb-6">Search Results</h2>
                                <div className="space-y-4">
                                    {flights.map((flight) => (
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
                                            <button 
                                                onClick={() => handleCreateTracker(flight.id)} // Will implement in next iteration
                                                className="px-4 py-2 rounded-lg bg-[#40E0FF]/10 text-[#40E0FF] hover:bg-[#40E0FF]/20 transition-colors"
                                            >
                                                Track Price
                                            </button>
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

export default FlightSearch;