import React, { useState } from 'react';
import axios from 'axios';
import { Search, Plane, Loader2 } from 'lucide-react';
import { Alert, AlertTitle } from '@/components/ui/alert';

const FlightSearch = () => {
    const [flightNumber, setFlightNumber] = useState('');
    const [flights, setFlights] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const response = await axios.get(`http://localhost:5000/flights?flight_number=${flightNumber}`);
            setFlights(response.data);
            if (response.data.length === 0) {
                setMessage('No flights found. Try another flight number.');
            }
        } catch (error) {
            console.error('Error fetching flights:', error);
            setMessage('Failed to fetch flights. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTrackFlight = async (flightId) => {
        try {
            await axios.post('http://localhost:5000/trackers', {
                user_id: 1, // For demo purposes
                flight_id: flightId
            });
            setMessage('Flight added to tracker successfully!');
        } catch (error) {
            setMessage('Failed to add flight to tracker.');
        }
    };

    return (
        <div className="space-y-6">
            {/* Search Form */}
            <div className="bg-white rounded-lg p-6">
                <form onSubmit={handleSearch} className="space-y-4">
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="flightNumber" className="text-sm font-medium text-gray-700">
                            Flight Number
                        </label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                id="flightNumber"
                                value={flightNumber}
                                onChange={(e) => setFlightNumber(e.target.value)}
                                className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Enter flight number (e.g., AA123)"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !flightNumber}
                                className="absolute inset-y-0 right-0 px-4 py-2 border-l border-gray-300 text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    'Search'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Messages */}
            {message && (
                <Alert variant={message.includes('successfully') ? 'default' : 'destructive'}>
                    <AlertTitle>{message}</AlertTitle>
                </Alert>
            )}

            {/* Results */}
            {flights.length > 0 && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="divide-y divide-gray-200">
                        {flights.map((flight) => (
                            <div key={flight.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-blue-100 p-2 rounded-full">
                                            <Plane className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">
                                                Flight {flight.flight_number}
                                            </h3>
                                            <div className="mt-1 text-sm text-gray-500">
                                                <span>{flight.origin}</span>
                                                <span className="mx-2">→</span>
                                                <span>{flight.destination}</span>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                Departure: {new Date(flight.departure_time).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleTrackFlight(flight.id)}
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Track Price
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && flights.length === 0 && flightNumber && (
                <div className="text-center py-12">
                    <Plane className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No flights found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try searching for a different flight number.</p>
                </div>
            )}
        </div>
    );
};

export default FlightSearch;