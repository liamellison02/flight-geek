import React, { useState } from 'react';
import axios from 'axios';

const HomePage = () => {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', {
                email: loginEmail,
                password: loginPassword,
            });
            setMessage(response.data.message || 'Login successful');
        } catch (error) {
            setMessage(error.response?.data?.error || 'Login failed');
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/signup', {
                email: signupEmail,
                password: signupPassword,
            });
            setMessage(response.data.message || 'Signup successful');
        } catch (error) {
            setMessage(error.response?.data?.error || 'Signup failed');
        }
    };

    return (
            <div style={{
                        textAlign: 'center',
                        padding: '20px',
                        fontFamily: 'Arial, sans-serif',
                        backgroundColor: '#4465a6',
                        minHeight: '96vh',
                        overflow: 'hidden'
                    }}>            
            
            <h1 style={{ color: '#000', marginBottom: '20px' }}>Welcome to the Flight Tracker App</h1>
            <br></br>

            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                marginTop: '20px',
                flexWrap: 'wrap'
            }}>               
                {/* Login Form */}
                <div style={{
                    width: '45%',
                    backgroundColor: '#fff',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(10, 10, 10, 10)',
                    marginBottom: '20px'
                }}>
                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                            style={{ display: 'block', margin: '10px auto', padding: '10px', width: '80%' }}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                            style={{ display: 'block', margin: '10px auto', padding: '10px', width: '80%' }}
                        />
                        <button
                            type="submit"
                            style={{
                                padding: '10px 20px',
                                marginTop: '10px',
                                cursor: 'pointer',
                                backgroundColor: '#007BFF',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px'
                            }}
                        >
                            Login
                        </button>
                    </form>
                </div>

                {/* Signup Form */}
                <div style={{
                    width: '45%',
                    backgroundColor: '#fff',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(10, 10, 10, 10)',
                    marginBottom: '20px'
                }}>
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSignup}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            required
                            style={{ display: 'block', margin: '10px auto', padding: '10px', width: '80%' }}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            required
                            style={{ display: 'block', margin: '10px auto', padding: '10px', width: '80%' }}
                        />
                        <button
                            type="submit"
                            style={{
                                padding: '10px 20px',
                                marginTop: '10px',
                                cursor: 'pointer',
                                backgroundColor: '#007BFF',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px'
                            }}
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>

            {message && <p style={{ marginTop: '20px', color: 'blue' }}>{message}</p>}
        </div>
    );
};

export default HomePage;
