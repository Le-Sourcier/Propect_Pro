import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, Play, Pause, X, Filter, Settings as SettingsIcon, Search, Plus } from 'lucide-react';

const ScrapingModule = () => {
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

  // Mock data for jobs (would normally come from API)
  const scrapingJobs = [
    { id: 1, source: 'Google Maps', query: 'Restaurants', location: 'Paris, France', status: 'completed', results: 122, date: '2023-05-15' },
    { id: 2, source: 'LinkedIn', query: 'Tech Companies', location: 'Lyon, France', status: 'in_progress', results: 46, date: '2023-05-14' },
    { id: 3, source: 'Yellow Pages', query: 'Electricians', location: 'Marseille, France', status: 'queued', results: 0, date: '2023-05-13' },
    { id: 4, source: 'Societe.com', query: 'SAS Companies', location: 'Nice, France', status: 'completed', results: 78, date: '2023-05-12' },
    { id: 5, source: 'Google Maps', query: 'Dentists', location: 'Toulouse, France', status: 'failed', results: 0, date: '2023-05-11' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTabChange('jobs');
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
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Scraping
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="overflow-x-auto">
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
                {scrapingJobs.map((job) => (
                  <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.source}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.query}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.status === 'completed' ? 'bg-green-100 text-green-800' :
                        job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        job.status === 'queued' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {job.status === 'completed' ? 'Completed' :
                        job.status === 'in_progress' ? 'In Progress' :
                        job.status === 'queued' ? 'Queued' :
                        'Failed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.results}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {job.status === 'in_progress' ? (
                        <button className="text-yellow-600 hover:text-yellow-900 mr-3">
                          <Pause className="h-4 w-4" />
                        </button>
                      ) : job.status === 'queued' ? (
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          <Play className="h-4 w-4" />
                        </button>
                      ) : null}
                      <button className="text-blue-600 hover:text-blue-900">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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