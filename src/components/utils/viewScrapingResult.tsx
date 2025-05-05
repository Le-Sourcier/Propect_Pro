import { Filter, Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useScrapingStore } from "../../stores/scrapingStore";
import React from "react";

function ViewScrapingResult() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");

  const {
    fetchJobById,
    resetSelectedJob,
    selectedJob: job,
    isLoading,
  } = useScrapingStore();

  React.useEffect(() => {
    if (jobId && !job) {
      fetchJobById(jobId);
    } else resetSelectedJob();
  }, [jobId]);

  return (
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
        {isLoading && <span className="text-sm">Loading job...</span>}
        {!isLoading && !job && <span className="text-sm">No job found</span>}
        {!isLoading && job && (
          <div className="text-sm">
            <strong>Source:</strong> {job.source} <br />
            <strong>Query:</strong> {job.query} <br />
            <strong>Status:</strong> {job.status} <br />
            <strong>Results:</strong> {job.results} <br />
            <strong>Created:</strong> {new Date(job.createdAt).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewScrapingResult;
