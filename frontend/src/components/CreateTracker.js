import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Home, PlaneTakeoff, AlertCircle } from 'lucide-react';

const CreateTracker = () => {
    const [userId, setUserId] = useState('');
    const [flightId, setFlightId] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateTracker = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/trackers', { 
                user_id: userId, 
                flight_id: flightId 
            });
            setMessage(response.data.message || 'Tracker created successfully');
        } catch (error) {
            setMessage(error.response?.data?.error || 'Failed to create tracker');
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
                                to="/create-tracker"
                                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-[#40E0FF]/30 hover:bg-[#40E0FF]/40 transition-colors"
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
                        Create Flight Tracker
                    </h1>
                    <p className="text-[#40E0FF] text-lg">
                        Start tracking your flight prices
                    </p>
                </div>

                {/* Tracker Form */}
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/10">
                        <form onSubmit={handleCreateTracker} className="space-y-6">
                            <div className="space-y-4">
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
                                <div>
                                    <label htmlFor="flightId" className="block text-sm font-medium text-[#40E0FF] mb-1">
                                        Flight ID
                                    </label>
                                    <input
                                        id="flightId"
                                        type="text"
                                        value={flightId}
                                        onChange={(e) => setFlightId(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg bg-black/20 border border-[#40E0FF]/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#40E0FF]/50 transition"
                                        placeholder="Enter flight ID to track"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full px-6 py-3 rounded-lg bg-[#40E0FF] text-[#001524] font-semibold hover:bg-[#40E0FF]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <PlaneTakeoff className="h-5 w-5" />
                                {isLoading ? 'Creating Tracker...' : 'Create Tracker'}
                            </button>
                        </form>

                        {/* Message Display */}
                        {message && (
                            <div className={`mt-6 p-4 rounded-lg ${
                                message.includes('success') 
                                    ? 'bg-green-500/10 border-green-500/20 text-green-100' 
                                    : 'bg-red-500/10 border-red-500/20 text-red-100'
                            } border flex items-center gap-2`}>
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                <p>{message}</p>
                            </div>
                        )}

                        {/* Help Text */}
                        <div className="mt-8 p-4 rounded-lg bg-[#40E0FF]/5 border border-[#40E0FF]/10">
                            <h3 className="text-[#40E0FF] font-medium mb-2 flex items-center gap-2">
                                <AlertCircle className="h-5 w-5" />
                                Quick Tips
                            </h3>
                            <ul className="text-gray-300 text-sm space-y-1">
                                <li>• User ID can be found in your profile settings</li>
                                <li>• Flight ID is shown in flight search results</li>
                                <li>• You'll receive notifications when prices change</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTracker;