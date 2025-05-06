import React from "react";
import { useSearchParams } from "react-router-dom";
import { useFilterSearch } from "../../hooks/useFilterSearch";
import { useScrapingStore } from "../../stores/scrapingStore";
import { EmptyState, LoadingState, ResultsTable, SearchFilter } from "../ui";
import ExportButtons from "../ui/components/ExportButtons";

function ViewScrapingResult() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId") || "demo";

  const {
    fetchJobById,
    resetSelectedJob,
    selectedJob: job,
    isLoading,
    error,
  } = useScrapingStore();

  const { filteredData, handleSearch, toggleFilter } = useFilterSearch(
    job?.result
  );

  React.useEffect(() => {
    if (jobId) {
      fetchJobById(jobId);
    } else {
      resetSelectedJob();
    }

    return () => {
      resetSelectedJob();
    };
  }, [jobId, fetchJobById, resetSelectedJob]);

  const renderContent = () => {
    if (!jobId) {
      return <EmptyState message="Please select a job to view results" />;
    }
    if (isLoading) {
      return <LoadingState />;
    }

    if (error) {
      return <EmptyState message={`Error: ${error}`} />;
    }

    if (!job || !job.result || job.result.length === 0) {
      return <EmptyState message="No job data found" />;
    }

    if (filteredData && filteredData.length === 0) {
      return <EmptyState message="No matching results found" />;
    }

    return <ResultsTable data={filteredData || job.result} />;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <SearchFilter onSearch={handleSearch} onFilterClick={toggleFilter} />
          {job?.result && job.result.length > 0 && (
            <ExportButtons
              data={filteredData || job.result}
              fileName={`scraping-results-${jobId}`}
            />
          )}
        </div>
        <div className="min-h-[16rem] overflow-hidden border border-gray-200 rounded-lg">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default ViewScrapingResult;

// import React from "react";
// import { useSearchParams, Navigate } from "react-router-dom";
// import { useFilterSearch } from "../../hooks/useFilterSearch";
// import { useScrapingStore } from "../../stores/scrapingStore";
// import { EmptyState, LoadingState, ResultsTable, SearchFilter } from "../ui";

// function ViewScrapingResult() {
//   const [searchParams] = useSearchParams();
//   const jobId = searchParams.get("jobId");
//   const [notFound, setNotFound] = React.useState(false);

//   const {
//     fetchJobById,
//     resetSelectedJob,
//     selectedJob: job,
//     isLoading,
//     error,
//   } = useScrapingStore();

//   const { filteredData, handleSearch, toggleFilter } = useFilterSearch(
//     job?.result
//   );

//   React.useEffect(() => {
//     if (jobId) {
//       fetchJobById(jobId).catch((err) => {
//         if (err.response?.status === 404) {
//           setNotFound(true);
//         }
//       });
//     } else {
//       resetSelectedJob();
//     }

//     return () => {
//       resetSelectedJob();
//       setNotFound(false);
//     };
//   }, [jobId, fetchJobById, resetSelectedJob]);

//   if (notFound) {
//     return <Navigate to="/404" replace />;
//   }

//   // Render content based on loading state and data
//   const renderContent = () => {
//     if (!jobId) {
//       return <EmptyState message="Please select a job to view results" />;
//     }

//     if (isLoading) {
//       return <LoadingState />;
//     }

//     if (error) {
//       return <EmptyState message={`Error: ${error}`} />;
//     }

//     if (!job || !job.result || job.result.length === 0) {
//       return <EmptyState message="No results found for this job" />;
//     }

//     if (filteredData && filteredData.length === 0) {
//       return <EmptyState message="No matching results found" />;
//     }

//     return <ResultsTable data={filteredData || job.result} />;
//   };

//   return (
//     <div className="bg-white rounded-lg shadow">
//       <div className="p-6">
//         {jobId && (
//           <SearchFilter onSearch={handleSearch} onFilterClick={toggleFilter} />
//         )}

//         <div className="min-h-[16rem] overflow-hidden border border-gray-200 rounded-lg">
//           {renderContent()}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ViewScrapingResult;
