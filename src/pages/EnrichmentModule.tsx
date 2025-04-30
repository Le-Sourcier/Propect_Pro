import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Database, Download, RefreshCw, FileText } from "lucide-react";
import MappingModule from "../components/utils/MapingDialog";
import PreviewEnrich from "../components/utils/previewEnrich";
import axios from "axios";
import { MappedColumns } from "../components/interface/mappingInterface";
import useAuth from "../hooks/useAuth";
// import { JobStatus } from "../components/interface/jobsInterface";
import socket from "../components/utils/socket";
import toast from "react-hot-toast";
import { EnrichmentJobsProps } from "../components/interface/jobsInterface";
import { useErichStore } from "../stores/enrichStore";

const BASE_URL = import.meta.env.VITE_API_URL;

const EnrichmentModule = () => {
  const { user } = useAuth();

  const {
    jobs: enrichmentJobs,
    isLoading,
    error,
    fetchJobs,
    downloadFile,
    createJob,
    updateJob,
    deleteJob,
  } = useErichStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "upload";
  const [columns, setColumns] = useState<string[]>([]);
  // const [job, setJob] = useState<JobStatus | null>(null);
  // const [enrichmentJobs, setEnrichmentJobs] = useState<EnrichmentJobsProps[]>(
  //   []
  // );

  const [selectedFile, setSelectedFile] = useState<File>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [mappedColumns, setMappedColumns] = useState<MappedColumns>({
    company_name: "",
    siret: "",
    siren: "",
    domain: "",
    email: "",
    phone: "",
    full_name: "",
    address: "",
    zip_code: "",
    city: "",
    country: "",
    naf_code: "",
    sector: "",
    employee_count: "",
  });

  React.useEffect(() => {
    if (user) {
      fetchJobs(user.id);
    }
  }, [user]);

  React.useEffect(() => {
    socket.on("jobStatusUpdate", (data) => {
      console.log("📦 Données reçues :", data);

      // setJob(data);

      switch (data.status) {
        case "completed":
          toast.success(`Task ready for ${data.id}`);
          break;
        case "in_progress":
          toast.loading(`Task in progress for ${data.id}`);
          break;
        case "queued":
          toast.loading(`Task queued for ${data.id}`);
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

  const [selectedForEnrichment, setSelectedForEnrichment] = useState<string[]>(
    []
  );

  // Mock data for enrichment jobs
  // const enrichmentJobs = [
  //   {
  //     id: 1,
  //     name: "May Restaurants",
  //     status: "completed",
  //     records: 122,
  //     enriched: 98,
  //     date: "2023-05-15",
  //     sources: ["INSEE", "LinkedIn", "Website"],
  //   },
  //   {
  //     id: 2,
  //     name: "Lyon Tech Companies",
  //     status: "in_progress",
  //     records: 87,
  //     enriched: 34,
  //     date: "2023-05-14",
  //     sources: ["INSEE", "Website"],
  //   },
  //   {
  //     id: 3,
  //     name: "Healthcare Providers",
  //     status: "queued",
  //     records: 215,
  //     enriched: 0,
  //     date: "2023-05-13",
  //     sources: ["INSEE", "LinkedIn", "Website", "SIRENE"],
  //   },
  // ];

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
      // status: "Limited Access",
      status: "Not Connected",
      // statusColor: "yellow",
      statusColor: "gray",
      defaultEnabled: false,
      icon: <Database className="h-5 w-5" />,
    },
    {
      id: "website",
      name: "Website Analysis",
      description: "Extract emails & contact details",
      // status: "Active",
      status: "Incoming",

      // statusColor: "green",
      statusColor: "yellow",
      defaultEnabled: false,
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
      status: "Connected",
      statusColor: "green",
      defaultEnabled: true,
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
    {
      id: "database",
      name: "Local Resources",
      description: "Business local resources and directories",
      status: "Connected",
      statusColor: "green",
      defaultEnabled: true,
      icon: <Database className="h-5 w-5" />,
    },
  ];
  const handleStartEnrichment = async () => {
    // Prepare form data with file and additional body fields
    const formData = new FormData();
    formData.append("file", selectedFile!);
    formData.append("query", "PLOMBIERS GARONNAIS");
    formData.append("location", "");
    // Append each requested column (rows) under the "rows[]" key
    columns.forEach((col) => formData.append("rows[]", col));

    try {
      const response = await axios.post(
        BASE_URL + "/job/enrich/file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob", // important pour récupérer le CSV
        }
      );

      console.log("Réponse du serveur :", response.data);
      return response.data; // Blob
    } catch (error) {
      console.error("Erreur d'envoi vers /enrich/file :", error);
      throw error;
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();

    const meta = {
      mapping: mappedColumns,
      expected_columns: selectedForEnrichment,
      user_id: user?.id,
    };

    formData.append("file", selectedFile!);
    formData.append("meta", JSON.stringify(meta));

    try {
      const res = await axios.post(BASE_URL + "/job/enrich/mapping", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // setResponse(res.data);
      console.log("Response: ", res.data);
      // Navigate to job screen
      handleTabChange("jobs");
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      if (error instanceof Error) {
        toast.error(`Une erreur est survenue ${error.message}`);
      } else {
        toast.error("Une erreur inconnue est survenue");
      }
    }
  };

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

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
        columns={columns}
        setColumns={setColumns}
        mappedColumns={mappedColumns}
        setMappedColumns={setMappedColumns}
        selectedForEnrichment={selectedForEnrichment}
        setSelectedForEnrichment={setSelectedForEnrichment}
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
              <PreviewEnrich file={selectedFile} onChange={handleFileChange} />

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
                  onClick={handleUpload}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  <Database className="h-4 w-4 mr-2" />
                  {isLoading ? "Processing" : "Start Enrichment"}{" "}
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
                        <button
                          onClick={() => downloadFile(job.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
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
