import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Upload, Database, Download, RefreshCw, FileText } from "lucide-react";
import MappingModule from "../components/utils/MapingDialog";

const EnrichmentModule = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "upload";
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mock data for enrichment jobs
  const enrichmentJobs = [
    {
      id: 1,
      name: "May Restaurants",
      status: "completed",
      records: 122,
      enriched: 98,
      date: "2023-05-15",
      sources: ["INSEE", "LinkedIn", "Website"],
    },
    {
      id: 2,
      name: "Lyon Tech Companies",
      status: "in_progress",
      records: 87,
      enriched: 34,
      date: "2023-05-14",
      sources: ["INSEE", "Website"],
    },
    {
      id: 3,
      name: "Healthcare Providers",
      status: "queued",
      records: 215,
      enriched: 0,
      date: "2023-05-13",
      sources: ["INSEE", "LinkedIn", "Website", "SIRENE"],
    },
  ];

  // Data sources configuration
  const dataSources = [
    {
      id: "insee",
      name: "INSEE API",
      description: "Official French business database",
      status: "Connected",
      statusColor: "green",
      defaultEnabled: true,
      icon: <Database className="h-5 w-5" />,
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      description: "Employee & decision maker info",
      status: "Limited Access",
      statusColor: "yellow",
      defaultEnabled: true,
      icon: <Database className="h-5 w-5" />,
    },
    {
      id: "website",
      name: "Website Analysis",
      description: "Extract emails & contact details",
      status: "Active",
      statusColor: "green",
      defaultEnabled: true,
      icon: <Database className="h-5 w-5" />,
    },
    {
      id: "societe",
      name: "Societe.com",
      description: "Financial & leadership data",
      status: "Not Connected",
      statusColor: "gray",
      defaultEnabled: false,
      icon: <Database className="h-5 w-5" />,
    },
    {
      id: "sirene",
      name: "SIRENE Database",
      description: "French company registration data",
      status: "Connected",
      statusColor: "green",
      defaultEnabled: true,
      icon: <Database className="h-5 w-5" />,
    },
    {
      id: "infogreffe",
      name: "Infogreffe",
      description: "Legal and financial information",
      status: "Not Connected",
      statusColor: "gray",
      defaultEnabled: false,
      icon: <Database className="h-5 w-5" />,
    },
    {
      id: "pappers",
      name: "Pappers API",
      description: "Company legal documents and filings",
      status: "Not Connected",
      statusColor: "gray",
      defaultEnabled: false,
      icon: <Database className="h-5 w-5" />,
    },
    {
      id: "google",
      name: "Google Places",
      description: "Business locations and reviews",
      status: "Connected",
      statusColor: "green",
      defaultEnabled: true,
      icon: <Database className="h-5 w-5" />,
    },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    // Handle file drop here
    const files = Array.from(e.dataTransfer.files);
    console.log("Files dropped:", files);
  };

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.log("Selected file:", file);
      console.log("File name:", file.name);
      setSelectedFile(file);
      setIsDialogOpen(true); // Open dialog
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    // setSelectedFile(undefined);
  };

  return (
    <>
      <MappingModule
        file={selectedFile}
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
      />
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex flex-wrap items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">
                Data Enrichment
              </h1>
              <div className="flex space-x-2 mt-2 sm:mt-0">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh API Keys
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
                onClick={() => handleTabChange("upload")}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "upload"
                    ? "bg-white shadow text-gray-800"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Upload Data
              </button>
              <button
                onClick={() => handleTabChange("jobs")}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "jobs"
                    ? "bg-white shadow text-gray-800"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Enrichment Jobs
              </button>
              <button
                onClick={() => handleTabChange("sources")}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "sources"
                    ? "bg-white shadow text-gray-800"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Data Sources
              </button>
            </nav>
          </div>

          {activeTab === "upload" && (
            <div className="px-6 py-5">
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center ${
                  dragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center">
                  <Upload className="h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Drop your file here
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Support for CSV or Excel files with SIRET/SIREN numbers
                  </p>
                  <div className="mt-4">
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Select File
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  File Requirements
                </h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• File must be in CSV or Excel (.xlsx, .xls) format</li>
                  <li>• Must contain a column with SIRET or SIREN numbers</li>
                  <li>• Maximum file size: 10 MB</li>
                  <li>
                    • Recommended: Include company names for better matching
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">
                  Select Data Sources for Enrichment
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {dataSources.map((source) => (
                    <div
                      key={source.id}
                      className="relative flex items-start p-4 bg-white rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center h-5">
                        <input
                          id={source.id}
                          name={source.id}
                          type="checkbox"
                          defaultChecked={source.defaultEnabled}
                          disabled={source.status === "Not Connected"}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor={source.id}
                            className="font-medium text-gray-700 text-sm"
                          >
                            {source.name}
                          </label>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              source.statusColor === "green"
                                ? "bg-green-100 text-green-800"
                                : source.statusColor === "yellow"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {source.status}
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs mt-1">
                          {source.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Start Enrichment
                </button>
              </div>
            </div>
          )}

          {activeTab === "jobs" && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
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
                      Records
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Enriched
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Sources
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
                  {enrichmentJobs.map((job) => (
                    <tr key={job.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {job.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            job.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : job.status === "in_progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {job.status === "completed"
                            ? "Completed"
                            : job.status === "in_progress"
                            ? "In Progress"
                            : "Queued"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {job.records}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {job.enriched} (
                        {Math.round((job.enriched / job.records) * 100) || 0}%)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-wrap gap-1">
                          {job.sources.map((source, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {source}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {job.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-2">
                          <FileText className="h-4 w-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          <Download className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "sources" && (
            <div className="px-6 py-5">
              <div className="space-y-6">
                {dataSources.map((source) => (
                  <div
                    key={source.id}
                    className="bg-gray-50 p-4 rounded-md border border-gray-200"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">
                          {source.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {source.description}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          source.statusColor === "green"
                            ? "bg-green-100 text-green-800"
                            : source.statusColor === "yellow"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {source.status}
                      </span>
                    </div>
                    {source.status !== "Not Connected" ? (
                      <div className="mt-4 flex items-center text-xs text-gray-500">
                        <span>API Key: ••••••••••••••••••••</span>
                        <button className="ml-2 text-blue-600 hover:text-blue-800">
                          Update
                        </button>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                          Connect API
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EnrichmentModule;
