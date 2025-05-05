import { useState } from "react";
import { Loader2 } from "lucide-react";
import { fieldMetadata } from "../mapping/fieldMetadata";
import useAuth from "../../../hooks/useAuth";
import { useErichStore } from "../../../stores/enrichStore";
import toast from "react-hot-toast";
import { logger } from "../logger";

interface EnrichmentModuleProps {
  file: File;
  mappedColumns: Record<string, string>;
  selectedFields: string[];
  onComplete: () => void;
}

function EnrichmentModule({
  file,
  mappedColumns,
  selectedFields,
  onComplete,
}: EnrichmentModuleProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();

  const { createJob } = useErichStore();

  const handleEnrichment = async () => {
    try {
      setIsLoading(true);
      setProgress(10);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", file);

      // Add metadata
      const meta = {
        mapping: mappedColumns,
        expected_columns: selectedFields,
        user_id: user?.id, // This should come from your auth system
        sources: ["google_maps", "pappers"], // Example sources
      };
      formData.append("meta", JSON.stringify(meta));

      setProgress(30);

      // Make the enrichment request
      const res = await createJob(formData, {
        onUploadProgress: (progressEvent) => {
          const progress =
            (progressEvent.loaded / (progressEvent.total || 0)) * 100;
          setProgress(30 + progress * 0.3); // 30-60% progress during upload
        },
      });

      setProgress(70);

      if (!res.data) {
        toast.error("Enrichment request failed");
      }

      const enrichedData = res.data;

      // Create and download the enriched file
      const enrichedHeaders = Object.keys(mappedColumns).map(
        (key) => fieldMetadata[key]?.label || key
      );
      const enrichedRows = enrichedData.map((row: any) =>
        Object.keys(mappedColumns).map((field) => row[field] || "")
      );

      setProgress(90);

      const csvContent = [
        enrichedHeaders.join(","),
        ...enrichedRows.map((row: string[]) => row.join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const fileName = file.name.replace(".csv", "_enriched.csv");

      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setProgress(100);
      onComplete();
    } catch (error) {
      logger.error("Error during enrichment:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold">Data Enrichment</h2>

      <div className="w-full max-w-md space-y-4">
        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="font-medium text-blue-800 mb-2">
            Selected Fields for Enrichment
          </h3>
          <ul className="space-y-2">
            {selectedFields.map((field) => (
              <li key={field} className="flex items-center gap-2 text-blue-700">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                {fieldMetadata[field]?.label || field}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleEnrichment}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-md text-white font-medium flex items-center justify-center gap-2 transition-colors ${
            isLoading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing... {progress.toFixed(0)}%
            </>
          ) : (
            "Start Enrichment"
          )}
        </button>

        {isLoading && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EnrichmentModule;
