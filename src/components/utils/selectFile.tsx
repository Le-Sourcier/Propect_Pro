import React, { useState } from "react";
import EnrichmentModule from "./mapping/enrichmentModule";
import { Upload, FileEdit, Trash2 } from "lucide-react";
import { fieldMetadata } from "./mapping/fieldMetadata";
import MappingModule from "./mapping/MappingModule";

interface MappedColumns {
  [key: string]: string;
}

function SelectFile() {
  const [file, setFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [mappedColumns, setMappedColumns] = useState<MappedColumns>({});
  const [selectedForEnrichment, setSelectedForEnrichment] = useState<string[]>(
    []
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showEnrichment, setShowEnrichment] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setShowPreview(false);
    setPreviewData([]);
    setShowEnrichment(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvData = event.target?.result as string;
      const firstLine = csvData.split("\n")[0];
      const headers = firstLine.split(",").map((header) => header.trim());
      setColumns(headers);
      setIsDialogOpen(true);
    };
    reader.readAsText(selectedFile);
  };

  const handleMappingComplete = async () => {
    if (!file) return;

    try {
      const text = await file.text();
      const rows = text.split("\n");
      const headers = rows[0].split(",").map((h) => h.trim());

      const previewRows = rows.slice(1, 6).map((row) => {
        const values = row.split(",").map((v) => v.trim());
        const mappedRow: Record<string, string> = {};

        Object.entries(mappedColumns).forEach(([targetField, sourceColumn]) => {
          const sourceIndex = headers.indexOf(sourceColumn);
          mappedRow[targetField] = sourceIndex >= 0 ? values[sourceIndex] : "";
        });

        return mappedRow;
      });

      setPreviewData(previewRows);
      setShowPreview(true);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error processing preview data:", error);
    }
  };

  const handleReset = () => {
    setFile(null);
    setColumns([]);
    setMappedColumns({});
    setSelectedForEnrichment([]);
    setPreviewData([]);
    setShowPreview(false);
    setShowEnrichment(false);
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleEnrichmentComplete = () => {
    setShowEnrichment(false);
    handleReset();
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full">
        <div className="flex justify-between items-center mb-6">
          {/* <h1 className="text-2xl font-bold">CSV Column Mapping</h1> */}
          {file && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsDialogOpen(true)}
                className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center gap-1"
              >
                <FileEdit className="h-4 w-4" />
                Edit Mapping
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
                Reset
              </button>
            </div>
          )}
        </div>

        {!showPreview ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer flex flex-col items-center gap-3"
            >
              <Upload className="h-12 w-12 text-gray-400" />
              <span className="text-gray-600">
                Click to upload or drag and drop your CSV file
              </span>
              <span className="text-sm text-gray-500">
                {file ? file.name : "No file selected"}
              </span>
            </label>
          </div>
        ) : showEnrichment ? (
          <EnrichmentModule
            file={file!}
            mappedColumns={mappedColumns}
            selectedFields={selectedForEnrichment}
            onComplete={handleEnrichmentComplete}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Mapped Data Preview</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => document.getElementById("fileInput")?.click()}
                  className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center gap-1"
                >
                  <Upload className="h-4 w-4" />
                  Upload New File
                </button>
                {selectedForEnrichment.length > 0 && (
                  <button
                    onClick={() => setShowEnrichment(true)}
                    className="px-3 py-2 text-sm text-white rounded-md bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors"
                  >
                    Start Enrichment
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(mappedColumns).map((field) => (
                      <th
                        key={field}
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {fieldMetadata[field]?.label || field}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.keys(mappedColumns).map((field) => (
                        <td
                          key={field}
                          className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap"
                        >
                          {row[field] || "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-sm text-gray-500">
              Showing first {previewData.length} rows of mapped data
            </p>
          </div>
        )}

        {file && isDialogOpen && (
          <MappingModule
            file={file}
            isOpen={isDialogOpen}
            onClose={handleMappingComplete}
            columns={columns}
            setColumns={setColumns}
            mappedColumns={mappedColumns}
            setMappedColumns={setMappedColumns}
            selectedForEnrichment={selectedForEnrichment}
            setSelectedForEnrichment={setSelectedForEnrichment}
          />
        )}
      </div>
    </div>
  );
}

export default SelectFile;
