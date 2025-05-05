import { useMemo, useState } from "react";
import { fieldMetadata } from "./fieldMetadata";
import { ArrowRight } from "lucide-react";

interface MappingPreviewProps {
  previewData: any[];
  mapping: Record<string, string>;
  columns: string[];
}

function MappingPreview({ previewData, mapping, columns }: MappingPreviewProps) {
  const [showRaw, setShowRaw] = useState(false);
  
  // Generate mapped preview data
  const mappedData = useMemo(() => {
    return previewData.map(row => {
      const mappedRow: Record<string, any> = {};
      
      Object.entries(mapping).forEach(([targetField, sourceColumn]) => {
        if (sourceColumn && row[sourceColumn] !== undefined) {
          mappedRow[targetField] = row[sourceColumn];
        } else {
          mappedRow[targetField] = null;
        }
      });
      
      return mappedRow;
    });
  }, [previewData, mapping]);

  // Get mapped fields that have data
  const activeFields = useMemo(() => {
    return Object.entries(mapping)
      .filter(([_, sourceColumn]) => sourceColumn)
      .map(([targetField]) => targetField);
  }, [mapping]);

  if (previewData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 mb-2">No preview data available</p>
          <p className="text-sm text-gray-400">
            Upload a file or map columns to see the preview
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Preview Controls */}
      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-medium">Data Preview</h3>
        <div className="flex items-center gap-2">
          <label className="text-sm flex items-center gap-1">
            <input
              type="checkbox"
              checked={showRaw}
              onChange={() => setShowRaw(!showRaw)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Show raw data
          </label>
        </div>
      </div>

      {/* Raw Data Preview */}
      {showRaw && (
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2 text-gray-700">Source Data (First 5 rows)</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map(column => (
                    <th
                      key={column}
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {previewData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map(column => (
                      <td key={column} className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                        {row[column] || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mapped Data Preview */}
      <div>
        <h4 className="text-sm font-medium mb-2 text-gray-700">
          {showRaw ? "Mapped Data (First 5 rows)" : "Mapped Data Preview"}
        </h4>
        
        {activeFields.length === 0 ? (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-center">
            <p className="text-gray-500">No mappings defined yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Map some columns to see the preview here
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="w-1/3 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Field
                  </th>
                  <th scope="col" className="w-1/3 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source Column
                  </th>
                  <th scope="col" className="w-1/3 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sample Values
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeFields.map(fieldKey => (
                  <tr key={fieldKey}>
                    <td className="px-4 py-2">
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{fieldMetadata[fieldKey]?.label || fieldKey}</span>
                        <span className="text-xs text-gray-500">{fieldKey}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-800">{mapping[fieldKey]}</span>
                        <ArrowRight className="h-3 w-3 mx-1 text-gray-400" />
                        <span className="text-sm text-blue-600">{fieldKey}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col gap-1">
                        {mappedData.slice(0, 3).map((row, idx) => (
                          <span key={idx} className="text-sm text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                            {row[fieldKey] !== null ? row[fieldKey] : <span className="text-gray-400">-</span>}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MappingPreview;