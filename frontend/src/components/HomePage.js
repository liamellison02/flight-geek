import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Home, Search, PlaneTakeoff } from 'lucide-react';

const HomePage = () => {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', { email: loginEmail, password: loginPassword });
            
            if (response.status === 200 || response.data.message === 'Login successful') {
                setMessage('Login successful');
                setMessageType('success');
                setTimeout(() => {
                    navigate('/search-flights');
                }, 500);
            }
        } catch (error) {
            setMessage(error.response?.data?.error || 'Login failed');
            setMessageType('error');
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
            setMessageType('success');
            setTimeout(() => {
                navigate('/search-flights');
            }, 500);
        } catch (error) {
            setMessage(error.response?.data?.error || 'Signup failed');
            setMessageType('error');
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

            {/* Existing Content */}
            <div className="px-4 py-8">
                {/* Logo and Title Section */}
                <div className="max-w-xl mx-auto text-center mb-12">
                    <img 
                        src="/logo.jpeg" 
                        alt="Flight Geek Logo" 
                        className="w-32 h-32 mx-auto mb-6"
                    />
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Welcome to Flight Geek
                    </h1>
                    <p className="text-[#40E0FF] text-lg">
                        Find and Track Flight Prices Today!
                    </p>
                </div>

                {/* Message Display */}
                {message && (
                    <div className={`max-w-md mx-auto mb-8 p-4 rounded-lg ${
                        messageType === 'success' 
                            ? 'bg-green-500/10 border border-green-500/20 text-green-100'
                            : 'bg-red-500/10 border border-red-500/20 text-red-100'
                        }`}>
                        <p className="text-center">{message}</p>
                    </div>
                )}

                {/* Forms Container */}
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
                    {/* Rest of your existing form code... */}
                    {/* Login Form */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-6">Login</h2>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <input
                                type="email"
                                placeholder="Email"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-lg bg-black/20 border border-[#40E0FF]/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#40E0FF]/50 transition"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-lg bg-black/20 border border-[#40E0FF]/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#40E0FF]/50 transition"
                            />
                            <button
                                type="submit"
                                className="w-full py-2 rounded-lg bg-[#40E0FF] text-[#001524] font-semibold hover:bg-[#40E0FF]/90 transition-colors"
                            >
                                Login
                            </button>
                        </form>
                    </div>

                    {/* Signup Form */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-6">Sign Up</h2>
                        <form onSubmit={handleSignup} className="space-y-4">
                            <input
                                type="email"
                                placeholder="Email"
                                value={signupEmail}
                                onChange={(e) => setSignupEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-lg bg-black/20 border border-[#40E0FF]/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#40E0FF]/50 transition"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={signupPassword}
                                onChange={(e) => setSignupPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-lg bg-black/20 border border-[#40E0FF]/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#40E0FF]/50 transition"
                            />
                            <button
                                type="submit"
                                className="w-full py-2 rounded-lg bg-[#40E0FF] text-[#001524] font-semibold hover:bg-[#40E0FF]/90 transition-colors"
                            >
                                Sign Up
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;