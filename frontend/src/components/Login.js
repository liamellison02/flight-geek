import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Alert, AlertTitle } from './ui/Alert';
import { Home } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', { email, password });
            setMessage(response.data.message);
            
            if (response.data.message === 'Login successful') {
                navigate('/dashboard');
            }
        } catch (error) {
            setMessage(error.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Home Navigation */}
            <div className="p-4">
                <Link 
                    to="/"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                >
                    <Home className="w-5 h-5 mr-2" />
                    Back to Home
                </Link>
            </div>

            {/* Login Form */}
            <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Sign in to your account
                        </h2>
                    </div>

                    {message && (
                        <Alert variant={message === 'Login successful' ? 'success' : 'destructive'}>
                            <AlertTitle>{message}</AlertTitle>
                        </Alert>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email" className="sr-only">Email address</label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Sign in
                            </button>
                        </div>

                        {/* Additional Navigation */}
                        <div className="text-sm text-center">
                            <Link
                                to="/"
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Need an account? Sign up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;