import React, { useState, useEffect } from 'react';
import axios from 'axios';

const History = ({ token }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true); // Manage loading state
    const [error, setError] = useState(null); // Manage error state

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true); // Start loading
            setError(null); // Clear previous errors

            try {
                const response = await axios.get('http://localhost:3001/history', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHistory(response.data); // Set the received history data
            } catch (error) {
                console.error('Error fetching history:', error);
                setError('Error fetching history. Please try again later.'); // Display error message
            } finally {
                setLoading(false); // Stop loading
            }
        };

        if (token) {
            fetchHistory(); // Fetch history if token is available
        }
    }, [token]);

    if (loading) {
        return <p>Loading history...</p>; // Show loading message
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>; // Show error message
    }

    return (
        <div>
            <h2>Login History</h2>
            {history.length === 0 ? (
                <p>No history available.</p> // Message if no history is available
            ) : (
                <ul>
                    {history.map((entry, index) => (
                        <li key={index}>
                            {entry.date}: {entry.success ? 'Success' : 'Failed'}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default History;
