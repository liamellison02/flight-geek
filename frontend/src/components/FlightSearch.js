import React, { useState } from 'react';
import axios from 'axios';

const FlightSearch = () => {
    const [flightNumber, setFlightNumber] = useState('');
    const [flights, setFlights] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:5000/flights?flight_number=${flightNumber}`);
            setFlights(response.data);
        } catch (error) {
            console.error('Error fetching flights:', error);
        }
    };

    return (
        <div>
            <h2>Search Flights</h2>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Flight Number"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>
            <div>
                {flights.map((flight) => (
                    <div key={flight.id}>
                        <p>Flight Number: {flight.flight_number}</p>
                        <p>Origin: {flight.origin}</p>
                        <p>Destination: {flight.destination}</p>
                        <p>Departure Time: {flight.departure_time}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FlightSearch;
