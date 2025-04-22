import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, Play, Pause, X, Filter, Settings as SettingsIcon, Search, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useScrapingStore } from '../stores/scrapingStore';
import toast from 'react-hot-toast';

const ScrapingModule = () => {
  const { user } = useAuth();
  const { jobs, isLoading, error, fetchJobs, createJob, updateJob, deleteJob } = useScrapingStore();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'new';
  
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState(50);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedSource, setSelectedSource] = useState('google-maps');
  const [proxyServers, setProxyServers] = useState([
    { id: 1, url: 'http://proxy1.example.com:8080', username: 'user1', password: '****' },
    { id: 2, url: 'http://proxy2.example.com:8080', username: 'user2', password: '****' }
  ]);
  const [newProxy, setNewProxy] = useState({ url: '', username: '', password: '' });

  useEffect(() => {
    if (user) {
      fetchJobs(user.id);
    }
  }, [user]);

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
  };

  // Available scraping sources
  const scrapingSources = [
    { id: 'google-maps', name: 'Google Maps', description: 'Local businesses and places' },
    { id: 'linkedin', name: 'LinkedIn', description: 'Company profiles and employees' },
    { id: 'yellow-pages', name: 'Yellow Pages', description: 'Business directories' },
    { id: 'societe-com', name: 'Societe.com', description: 'French company information' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query || !location) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createJob({
        user_id: user.id,
        source: selectedSource,
        query,
        location,
        status: 'pending',
        results: 0,
        date: new Date().toISOString()
      });

      toast.success('Scraping job created successfully');
      handleTabChange('jobs');
    } catch (error) {
      toast.error('Failed to create scraping job');
    }
  };

  const handleAddProxy = () => {
    if (newProxy.url && newProxy.username && newProxy.password) {
      setProxyServers([...proxyServers, { 
        id: Date.now(),
        ...newProxy 
      }]);
      setNewProxy({ url: '', username: '', password: '' });
    }
  };

  const handleRemoveProxy = (id: number) => {
    setProxyServers(proxyServers.filter(proxy => proxy.id !== id));
  };

  const handleStartJob = async (jobId: string) => {
    try {
      await updateJob(jobId, { status: 'running' });
      toast.success('Job started successfully');
    } catch (error) {
      toast.error('Failed to start job');
    }
  };

  const handlePauseJob = async (jobId: string) => {
    try {
      await updateJob(jobId, { status: 'pending' });
      toast.success('Job paused successfully');
    } catch (error) {
      toast.error('Failed to pause job');
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      await deleteJob(jobId);
      toast.success('Job deleted successfully');
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Business Data Scraping</h1>
            <div className="flex space-x-2 mt-2 sm:mt-0">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <SettingsIcon className="h-4 w-4 mr-2" />
                Advanced Settings
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">
          <nav className="flex space-x-4">
            <button
              onClick={() => handleTabChange('new')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'new'
                  ? 'bg-white shadow text-gray-800'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              New Scraping Job
            </button>
            <button
              onClick={() => handleTabChange('jobs')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'jobs'
                  ? 'bg-white shadow text-gray-800'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Scraping Jobs
            </button>
            <button
              onClick={() => handleTabChange('results')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'results'
                  ? 'bg-white shadow text-gray-800'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Scraping Results
            </button>
          </nav>
        </div>

        {activeTab === 'new' && (
          <div className="px-6 py-5">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Data Source
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {scrapingSources.map((source) => (
                    <div
                      key={source.id}
                      className={`cursor-pointer rounded-lg border p-4 ${
                        selectedSource === source.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedSource(source.id)}
                    >
                      <h3 className="font-medium text-gray-900">{source.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{source.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="query" className="block text-sm font-medium text-gray-700">
                    Search Query
                  </label>
                  <input
                    type="text"
                    id="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., Restaurants, Plumbers, Hotels"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">Enter the type of businesses you want to scrape</p>
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Paris, Lyon, Marseille"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">Enter the location you want to target</p>
                </div>
              </div>

              <div>
                <label htmlFor="results" className="block text-sm font-medium text-gray-700">
                  Maximum Results: {results}
                </label>
                <input
                  type="range"
                  id="results"
                  min="10"
                  max="500"
                  step="10"
                  value={results}
                  onChange={(e) => setResults(Number(e.target.value))}
                  className="mt-1 block w-full"
                />
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>10</span>
                  <span>250</span>
                  <span>500</span>
                </div>
              </div>

              {showSettings && (
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-700">Advanced Settings</h3>
                    <button
                      type="button"
                      onClick={() => setShowSettings(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Proxy Servers (Optional)
                      </label>
                      <div className="space-y-3">
                        {proxyServers.map((proxy) => (
                          <div key={proxy.id} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={proxy.url}
                              readOnly
                              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-50"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveProxy(proxy.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        
                        <div className="space-y-2">
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              placeholder="Proxy URL"
                              value={newProxy.url}
                              onChange={(e) => setNewProxy({ ...newProxy, url: e.target.value })}
                              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Username"
                              value={newProxy.username}
                              onChange={(e) => setNewProxy({ ...newProxy, username: e.target.value })}
                              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                            <input
                              type="password"
                              placeholder="Password"
                              value={newProxy.password}
                              onChange={(e) => setNewProxy({ ...newProxy, password: e.target.value })}
                              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleAddProxy}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Proxy
                          </button>
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Add multiple proxy servers for automatic rotation during scraping
                      </p>
                    </div>

                    <div>
                      <label htmlFor="delay" className="block text-sm font-medium text-gray-700">
                        Delay Between Requests (seconds)
                      </label>
                      <input
                        type="number"
                        id="delay"
                        defaultValue={2}
                        min={1}
                        max={10}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        id="extract-emails"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="extract-emails" className="ml-2 block text-sm text-gray-700">
                        Extract emails from websites
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="use-stealth"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="use-stealth" className="ml-2 block text-sm text-gray-700">
                        Use Stealth Mode (Reduces detection risk)
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isLoading ? 'Creating...' : 'Start Scraping'}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No scraping jobs found</p>
                <button
                  onClick={() => handleTabChange('new')}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Job
                </button>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Query
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Results
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.source}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.query}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          job.status === 'completed' ? 'bg-green-100 text-green-800' :
                          job.status === 'running' ? 'bg-blue-100 text-blue-800' :
                          job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.results}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(job.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {job.status === 'running' ? (
                          <button
                            onClick={() => handlePauseJob(job.id)}
                            className="text-yellow-600 hover:text-yellow-900 mr-3"
                          >
                            <Pause className="h-4 w-4" />
                          </button>
                        ) : job.status === 'pending' ? (
                          <button
                            onClick={() => handleStartJob(job.id)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <Play className="h-4 w-4" />
                          </button>
                        ) : null}
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'results' && (
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              <div className="relative rounded-md w-full sm:w-64">
                <input
                  type="text"
                  className="block w-full rounded-md border-gray-300 pr-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Search results..."
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
            </div>
            
            <div className="h-64 flex items-center justify-center text-gray-500 border border-dashed border-gray-300 rounded-md">
              <span className="text-sm">Select a scraping job to view results</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScrapingModule;