import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useFilterSearch } from "../../hooks/useFilterSearch";
import { useScrapingStore } from "../../stores/scrapingStore";
import { EmptyState, LoadingState, ResultsTable, SearchFilter } from "../ui";
import ExportButtons from "../ui/components/ExportButtons";

function ViewScrapingResult() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");

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

  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 25;

  const paginatedData = useMemo(() => {
    const allData = filteredData || job?.result || [];
    const start = (currentPage - 1) * resultsPerPage;
    const end = start + resultsPerPage;
    return allData.slice(start, end);
  }, [filteredData, job, currentPage]);

  const totalResults = filteredData?.length || job?.result?.length || 0;
  const totalPages = Math.ceil(totalResults / resultsPerPage);

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

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        <span className="px-4 py-1 text-sm text-gray-600">
          Page {currentPage} sur {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
          disabled={currentPage === totalPages}
        >
          Suivant
        </button>
      </div>
    );
  };

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

    return (
      <>
        <ResultsTable data={paginatedData} />
        {renderPagination()}
      </>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          {job?.result && job.result.length > 0 && (
            <>
              <SearchFilter
                onSearch={handleSearch}
                onFilterClick={toggleFilter}
              />
              <ExportButtons
                data={filteredData || job.result}
                fileName={`scraping-results-${jobId}`}
              />
            </>
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
// import { useSearchParams } from "react-router-dom";
// import { useFilterSearch } from "../../hooks/useFilterSearch";
// import { useScrapingStore } from "../../stores/scrapingStore";
// import { EmptyState, LoadingState, ResultsTable, SearchFilter } from "../ui";
// import ExportButtons from "../ui/components/ExportButtons";

// function ViewScrapingResult() {
//   const [searchParams] = useSearchParams();
//   const jobId = searchParams.get("jobId");

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
//       fetchJobById(jobId);
//     } else {
//       resetSelectedJob();
//     }

//     return () => {
//       resetSelectedJob();
//     };
//   }, [jobId, fetchJobById, resetSelectedJob]);

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
//       return <EmptyState message="No job data found" />;
//     }

//     if (filteredData && filteredData.length === 0) {
//       return <EmptyState message="No matching results found" />;
//     }

//     return <ResultsTable data={filteredData || job.result} />;
//   };

//   return (
//     <div className="bg-white rounded-lg shadow">
//       <div className="p-6">
//         <div className="flex justify-between items-center mb-6">
//           {job?.result && job.result.length > 0 && (
//             <>
//               <SearchFilter
//                 onSearch={handleSearch}
//                 onFilterClick={toggleFilter}
//               />
//               <ExportButtons
//                 data={filteredData || job.result}
//                 fileName={`scraping-results-${jobId}`}
//               />
//             </>
//           )}
//         </div>
//         <div className="min-h-[16rem] overflow-hidden border border-gray-200 rounded-lg">
//           {renderContent()}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ViewScrapingResult;
