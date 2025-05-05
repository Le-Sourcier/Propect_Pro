import { useState, useEffect } from "react";
import { X, ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import MappingProfiles from "./MappingProfiles";
import MappingInterface from "./MappingInterface";
import MappingPreview from "./MappingPreview";
import { MappedColumns } from "../../interface/mappingInterface";

interface MappingDialogProps {
  file?: File;
  isOpen: boolean;
  onClose: () => void;
  columns: string[];
  setColumns: (columns: string[]) => void;
  mappedColumns: MappedColumns;
  setMappedColumns: React.Dispatch<React.SetStateAction<MappedColumns>>;
  selectedForEnrichment: string[];
  setSelectedForEnrichment: React.Dispatch<React.SetStateAction<string[]>>;
}

function MappingModule({ ...props }: MappingDialogProps) {
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [mode, setMode] = useState<"basic" | "advanced">("basic");
  const [step, setStep] = useState<"mapping" | "preview">("mapping");

  // Initialize mapping from props if available
  useEffect(() => {
    if (props.mappedColumns) {
      const initialMapping: Record<string, string> = {};
      Object.entries(props.mappedColumns).forEach(
        ([targetField, sourceColumn]) => {
          initialMapping[targetField] = sourceColumn;
        }
      );
      setMapping(initialMapping);
    }
  }, [props.mappedColumns]);

  // Process file to get preview data
  useEffect(() => {
    if (props.file && props.columns.length > 0) {
      loadPreviewData(props.file, 5);
    }
  }, [props.file, props.columns]);

  // Load preview data from file
  const loadPreviewData = async (file: File, rowCount: number) => {
    try {
      const text = await file.text();
      const rows = text.split("\n").slice(1, rowCount + 1); // Skip header, get first few rows
      const header = props.columns;

      const data = rows.map((row) => {
        const values = row.split(","); // Simple CSV parsing
        const rowData: Record<string, string> = {};

        header.forEach((col, index) => {
          if (index < values.length) {
            rowData[col] = values[index];
          }
        });

        return rowData;
      });

      setPreviewData(data);
    } catch (error) {
      console.error("Error loading preview data:", error);
    }
  };

  // Apply current mapping
  const applyMapping = () => {
    const newMappedColumns: MappedColumns = {};

    Object.entries(mapping).forEach(([targetField, sourceColumn]) => {
      if (sourceColumn) {
        newMappedColumns[targetField] = sourceColumn;
      }
    });

    props.setMappedColumns(newMappedColumns);

    // Update enrichment fields based on mapping
    const enrichmentFields = Object.keys(mapping).filter(
      (field) =>
        mapping[field] &&
        ["company_name", "siret", "siren", "domain", "email"].includes(field)
    );

    props.setSelectedForEnrichment(enrichmentFields);
    props.onClose();
  };

  // Handle field mapping change
  const handleMappingChange = (targetField: string, sourceColumn: string) => {
    setMapping((prev) => ({
      ...prev,
      [targetField]: sourceColumn,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {step === "preview" && (
                <button
                  onClick={() => setStep("mapping")}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <h2 className="text-xl font-semibold">
                {step === "mapping" ? "Map CSV Columns" : "Preview Mapped Data"}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  className={`px-3 py-1 text-sm ${
                    mode === "basic"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setMode("basic")}
                >
                  Basic
                </button>
                <button
                  className={`px-3 py-1 text-sm ${
                    mode === "advanced"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setMode("advanced")}
                >
                  Advanced
                </button>
              </div>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-1 text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                {showPreview ? (
                  <>
                    <EyeOff className="h-4 w-4" /> Hide Preview
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" /> Show Preview
                  </>
                )}
              </button>
              <button
                onClick={props.onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row h-[calc(90vh-132px)]">
          {/* Mapping Section */}
          <div
            className={`${
              showPreview ? "w-full md:w-1/2" : "w-full"
            } h-full overflow-hidden flex flex-col`}
          >
            {step === "mapping" ? (
              <>
                {/* Profiles Section */}
                <MappingProfiles mapping={mapping} setMapping={setMapping} />

                {/* Mapping Interface */}
                <div className="flex-1 overflow-y-auto p-4">
                  <MappingInterface
                    columns={props.columns}
                    mapping={mapping}
                    onMappingChange={handleMappingChange}
                    mode={mode}
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 overflow-y-auto p-4">
                <MappingPreview
                  previewData={previewData}
                  mapping={mapping}
                  columns={props.columns}
                />
              </div>
            )}
          </div>

          {/* Preview Section */}
          {showPreview && step === "mapping" && (
            <div className="w-full md:w-1/2 border-t md:border-t-0 md:border-l border-gray-200 h-full overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-medium">Data Preview</h3>
                <p className="text-sm text-gray-500">
                  See how your data will be mapped
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <MappingPreview
                  previewData={previewData}
                  mapping={mapping}
                  columns={props.columns}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
          <div>
            <span className="text-sm text-gray-500">
              {Object.values(mapping).filter(Boolean).length} of{" "}
              {Object.keys(mapping).length} fields mapped
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={props.onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            {step === "mapping" ? (
              <>
                <button
                  onClick={() => setStep("preview")}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  Preview Results
                </button>
                <button
                  onClick={applyMapping}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Apply Mapping
                </button>
              </>
            ) : (
              <button
                onClick={applyMapping}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Confirm & Apply
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MappingModule;
