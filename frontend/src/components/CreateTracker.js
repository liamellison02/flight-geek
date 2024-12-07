import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { History, AlertTriangle, Trash2 } from 'lucide-react';
import { Alert, AlertTitle } from '@/components/ui/alert';

const CreateTracker = () => {
    const [trackedFlights, setTrackedFlights] = useState([
        // Demo data
        {
            id: 1,
            flight_number: 'AA123',
            origin: 'LAX',
            destination: 'JFK',
            priceHistory: [
                { date: '2024-03-01', price: 299 },
                { date: '2024-03-02', price: 325 },
                { date: '2024-03-03', price: 310 },
                { date: '2024-03-04', price: 289 },
                { date: '2024-03-05', price: 299 },
            ]
        },
        {
            id: 2,
            flight_number: 'UA456',
            origin: 'SFO',
            destination: 'ORD',
            priceHistory: [
                { date: '2024-03-01', price: 199 },
                { date: '2024-03-02', price: 225 },
                { date: '2024-03-03', price: 210 },
                { date: '2024-03-04', price: 189 },
                { date: '2024-03-05', price: 199 },
            ]
        }
    ]);

    const handleRemoveTracker = async (flightId) => {
        try {
            await axios.delete(`http://localhost:5000/tracker/${flightId}`);
            setTrackedFlights(prev => prev.filter(flight => flight.id !== flightId));
        } catch (error) {
            console.error('Error removing tracker:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-medium text-gray-900">Your Tracked Flights</h2>
                    <span className="text-sm text-gray-500">
                        {trackedFlights.length} flights tracked
                    </span>
                </div>

                {trackedFlights.length === 0 ? (
                    <div className="text-center py-12">
                        <History className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No tracked flights</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Search for flights to start tracking prices.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {trackedFlights.map((flight) => (
                            <div key={flight.id} className="bg-gray-50 rounded-lg p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">
                                            Flight {flight.flight_number}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {flight.origin} → {flight.destination}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveTracker(flight.id)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={flight.priceHistory}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis 
                                                dataKey="date" 
                                                tickFormatter={(date) => new Date(date).toLocaleDateString()}
                                            />
                                            <YAxis />
                                            <Tooltip 
                                                formatter={(value) => [`$${value}`, 'Price']}
                                                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                                            />
                                            <Line 
                                                type="monotone" 
                                                dataKey="price" 
                                                stroke="#2563eb" 
                                                strokeWidth={2}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Price Alert */}
                                <div className="mt-4 bg-yellow-50 p-4 rounded-md">
                                    <div className="flex">
                                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-yellow-800">
                                                Price Alert
                                            </h3>
                                            <p className="text-sm text-yellow-700 mt-1">
                                                Current price is lower than average. Good time to book!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateTracker;