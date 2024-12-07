import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FlightSearch from './FlightSearch';
import CreateTracker from './CreateTracker';
import { Plane, Home, History } from 'lucide-react';

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState('search');
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Home Link */}
            <div className="flex">
              <Link 
                to="/"
                className="flex-shrink-0 flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <Home size={24} />
                <span className="font-bold text-lg">Flight Geek</span>
              </Link>
            </div>

            {/* Main Navigation */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleTabChange('search')}
                className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md ${
                  activeTab === 'search'
                    ? 'text-white bg-blue-600 hover:bg-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Plane className="mr-2" size={18} />
                Flight Search
              </button>
              <button
                onClick={() => handleTabChange('tracker')}
                className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md ${
                  activeTab === 'tracker'
                    ? 'text-white bg-blue-600 hover:bg-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <History className="mr-2" size={18} />
                Price Tracker
              </button>

              {/* Demo Navigation */}
              <Link
                to="/"
                className="inline-flex items-center px-3 py-2 ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Content Header */}
        <div className="px-4 sm:px-0 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {activeTab === 'search' ? 'Search Flights' : 'Track Flight Prices'}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {activeTab === 'search' 
              ? 'Search for flights and track their prices over time'
              : 'View and manage your tracked flight prices'}
          </p>
        </div>

        {/* Tab Content */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              {activeTab === 'search' ? <FlightSearch /> : <CreateTracker />}
            </div>
          </div>
        </div>
      </main>

      {/* Demo Helper Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-blue-50 border-t border-blue-100 p-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-sm text-blue-600 flex items-center justify-between">
            <span>Demo Navigation:</span>
            <div className="space-x-4">
              <Link to="/" className="hover:text-blue-800">Home</Link>
              <span>→</span>
              <Link to="/dashboard" className="hover:text-blue-800">Dashboard</Link>
              <span>→</span>
              <button 
                onClick={() => handleTabChange('search')} 
                className="hover:text-blue-800"
              >
                Search
              </button>
              <span>→</span>
              <button 
                onClick={() => handleTabChange('tracker')} 
                className="hover:text-blue-800"
              >
                Tracker
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;