import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Play,
  Pause,
  X,
  Settings as SettingsIcon,
  Plus,
  RotateCcw,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { useScrapingStore } from "../stores/scrapingStore";
import toast from "react-hot-toast";
import socket from "../components/utils/socket";
import ViewScrapingResult from "../components/utils/viewScrapingResult";

const ScrapingModule = () => {
  const { user } = useAuth();
  const { jobs, isLoading, error, fetchJobs, createJob, updateJob, deleteJob } =
    useScrapingStore();
  // const [jobId, setJobId] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "new";

  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [results, setResults] = useState(50);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedSource, setSelectedSource] = useState("google-maps");
  const [enabledSource, setEnabledSource] = useState(false);
  const [proxyServers, setProxyServers] = useState([
    {
      id: 1,
      url: "http://proxy1.example.com:8080",
      username: "user1",
      password: "****",
    },
    {
      id: 2,
      url: "http://proxy2.example.com:8080",
      username: "user2",
      password: "****",
    },
  ]);
  const [newProxy, setNewProxy] = useState({
    url: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      fetchJobs(user.id);
    }
  }, [user]);

  React.useEffect(() => {
    socket.on("jobStatusUpdate", (data) => {
      switch (data.status) {
        case "completed":
          toast.success(`Task ready for ${data.name}`);
          break;
        case "in_progress":
          // toast.loading(`Task in progress for ${data.name}`);
          break;
        case "queued":
          toast.loading(`Task queued for ${data.name}`);
          break;
        case "failed":
        default:
          toast.error(`Task failed for ${data.id}`);
          break;
      }
    });

    return () => {
      socket.off("jobStatusUpdate");
    };
  }, []);

  useEffect(() => {
    if (selectedSource === "pappers") {
      setLocation("France");
    } else {
      setLocation("");
    }
  }, [selectedSource]);

  // Update URL when tab changes
  // const handleTabChange = (tab: string) => {
  //   setSearchParams({ tab });
  // };

  const handleTabChange = (tab: string, jobId?: string) => {
    const params: Record<string, string> = { tab };
    if (jobId) {
      params.jobId = jobId;
    }
    setSearchParams(params);
  };

  // Available scraping sources
  const scrapingSources = [
    {
      id: "google-maps",
      name: "Google Maps",
      description: "Local businesses and places",
      enabled: true,
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      description: "Company profiles and employees",
      enabled: false,
    },
    {
      id: "pappers",
      // name: "Yellow Pages",
      name: "Pappers",
      description: "Business directories",
      enabled: true,
    },
    {
      id: "societe-com",
      name: "Societe.com",
      description: "French company information",
      enabled: false,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query || !location) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createJob({
        user_id: user?.id,
        source: selectedSource,
        query,
        location,
        status: "pending",
        results: 0,
        limite: results === 0 ? null : results,
        createdAt: new Date().toISOString(),
      });

      toast.success("Scraping job created successfully");
      handleTabChange("jobs");
    } catch (error) {
      toast.error("Failed to create scraping job");
    }
  };

  const handleAddProxy = () => {
    if (newProxy.url && newProxy.username && newProxy.password) {
      setProxyServers([
        ...proxyServers,
        {
          id: Date.now(),
          ...newProxy,
        },
      ]);
      setNewProxy({ url: "", username: "", password: "" });
    }
  };

  const handleRemoveProxy = (id: number) => {
    setProxyServers(proxyServers.filter((proxy) => proxy.id !== id));
  };

  const handleStartJob = async (jobId: string) => {
    try {
      await updateJob(jobId, { status: "running" });
      toast.success("Job started successfully");
    } catch (error) {
      toast.error("Failed to start job");
    }
  };

  const handleRestartStartJob = async (jobId: string) => {
    try {
      await updateJob(jobId, { status: "running" });
      toast.success("Job has restarted successfully");
    } catch (error) {
      toast.error("Failed to restart job");
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      await deleteJob(jobId);
      toast.success("Job deleted successfully");
    } catch (error) {
      toast.error("Failed to delete job");
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
            <h1 className="text-2xl font-semibold text-gray-900">
              Business Data Scraping
            </h1>
            <div className="flex space-x-2 mt-2 sm:mt-0">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <SettingsIcon className="h-4 w-4 mr-2" />
                Advanced Settings
              </button>
              {/* <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </button> */}
            </div>
          </div>
        </div>

        <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">
          <nav className="flex space-x-4">
            <button
              onClick={() => handleTabChange("new")}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === "new"
                  ? "bg-white shadow text-gray-800"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              New Scraping Job
            </button>
            <button
              onClick={() => handleTabChange("jobs")}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === "jobs"
                  ? "bg-white shadow text-gray-800"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Scraping Jobs
            </button>
            <button
              onClick={() => handleTabChange("results")}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === "results"
                  ? "bg-white shadow text-gray-800"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Scraping Results
            </button>
          </nav>
        </div>

        {activeTab === "new" && (
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
                          ? source.enabled
                            ? "border-blue-500 bg-blue-50"
                            : "border-red-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => {
                        setSelectedSource(source.id);
                        setEnabledSource(source.enabled);
                      }}
                    >
                      <h3 className="font-medium text-gray-900">
                        {source.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {source.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="query"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Search Query
                  </label>
                  <input
                    type="text"
                    id="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={!enabledSource}
                    placeholder="e.g., Restaurants, Plumbers, Hotels"
                    className="p-1 mt-1 block w-full rounded-md dark:bg-gray-200 bg-gray-400 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the type of businesses you want to scrape
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    disabled={selectedSource === "pappers" || !enabledSource}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Paris, Lyon, Marseille"
                    className="p-1 mt-1 block w-full rounded-md dark:bg-gray-200 bg-gray-400 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the location you want to target
                  </p>
                </div>
              </div>
              <div>
                <label
                  htmlFor="results"
                  className="block text-sm font-medium text-gray-700"
                >
                  Maximum Results:{" "}
                  <span
                    style={{
                      color: results === 0 ? "#075bf7" : "black",
                    }}
                  >
                    {results === 0 ? "auto" : results}
                  </span>
                </label>
                <input
                  type="range"
                  id="results"
                  min="0"
                  max="400"
                  step="10"
                  value={results}
                  onChange={(e) => setResults(Number(e.target.value))}
                  className={`mt-1 block w-full transition-colors duration-200 ${
                    results === 0 ? "text-gray-400 accent-gray-200" : "#075bf7"
                  }`}
                />
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  {[
                    { label: "auto", value: 0 },
                    { label: "130", value: 10 },
                    { label: "270", value: 250 },
                    { label: "400", value: 400 },
                  ].map(({ label, value }) => (
                    <span
                      key={value}
                      onClick={() => setResults(value)}
                      className={`cursor-pointer ${
                        results === value ? "text-blue-600 font-semibold" : ""
                      }`}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {showSettings && (
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-700">
                      Advanced Settings
                    </h3>
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
                          <div
                            key={proxy.id}
                            className="flex items-center space-x-2"
                          >
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
                              onChange={(e) =>
                                setNewProxy({
                                  ...newProxy,
                                  url: e.target.value,
                                })
                              }
                              className="rounded-md border-gray-300 p-1 dark:bg-gray-200 bg-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Username"
                              value={newProxy.username}
                              onChange={(e) =>
                                setNewProxy({
                                  ...newProxy,
                                  username: e.target.value,
                                })
                              }
                              className="rounded-md border-gray-300 p-1 dark:bg-gray-200 bg-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                            <input
                              type="password"
                              placeholder="Password"
                              value={newProxy.password}
                              onChange={(e) =>
                                setNewProxy({
                                  ...newProxy,
                                  password: e.target.value,
                                })
                              }
                              className="rounded-md border-gray-300 p-1 dark:bg-gray-200 bg-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
                        Add multiple proxy servers for automatic rotation during
                        scraping
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="delay"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Delay Between Requests (seconds)
                      </label>
                      <input
                        type="number"
                        id="delay"
                        defaultValue={2}
                        min={1}
                        max={10}
                        className="mt-1 block w-full rounded-md p-1 dark:bg-gray-200 bg-gray-400 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        id="extract-emails"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="extract-emails"
                        className="ml-2 block text-sm text-gray-700"
                      >
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
                      <label
                        htmlFor="use-stealth"
                        className="ml-2 block text-sm text-gray-700"
                      >
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
                  {isLoading ? "Creating..." : "Start Scraping"}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "jobs" && (
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
                  onClick={() => handleTabChange("new")}
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
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Source
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Query
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Results
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="hover:bg-gray-50"
                      // onClick={() => handleTabChange("results", job.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {job.source}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer"
                        onClick={() => handleTabChange("results", job.id)}
                      >
                        {job.query}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                        onClick={() => handleTabChange("results", job.id)}
                      >
                        {job.location}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap cursor-pointer"
                        onClick={() => handleTabChange("results", job.id)}
                      >
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            job.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : job.status === "running"
                              ? "bg-blue-100 text-blue-800"
                              : job.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {job.status.charAt(0).toUpperCase() +
                            job.status.slice(1)}
                        </span>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                        onClick={() => handleTabChange("results", job.id)}
                      >
                        {job.results}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                        onClick={() => handleTabChange("results", job.id)}
                      >
                        {job.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {job.status === "running" ? (
                          <button
                            // onClick={() => handlePauseJob(job.id)}
                            disabled
                            className="text-gray-300 hover:text-gray-400 mr-3  cursor-progress"
                          >
                            <Pause className="h-4 w-4" />
                          </button>
                        ) : job.status === "pending" ? (
                          <button
                            onClick={() => handleStartJob(job.id)}
                            className="z-50 text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <Play className="h-4 w-4" />
                          </button>
                        ) : job.status === "failed" ? (
                          <button
                            onClick={() => handleRestartStartJob(job.id)}
                            className="text-gray-500 hover:text-red-500 mr-3 cursor-pointer "
                          >
                            <RotateCcw className="h-4 w-4" />
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

        {activeTab === "results" && <ViewScrapingResult />}
      </div>
    </div>
  );
};

export default ScrapingModule;
