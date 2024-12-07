import React, { useState } from 'react';
import axios from 'axios';

const CreateTracker = () => {
    const [userId, setUserId] = useState('');
    const [flightId, setFlightId] = useState('');
    const [message, setMessage] = useState('');

    const handleCreateTracker = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/trackers', { user_id: userId, flight_id: flightId });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <div>
            <h2>Create Flight Tracker</h2>
            <form onSubmit={handleCreateTracker}>
                <input
                    type="text"
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Flight ID"
                    value={flightId}
                    onChange={(e) => setFlightId(e.target.value)}
                    required
                />
                <button type="submit">Create Tracker</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default CreateTracker;
