import { useState, useEffect } from "react";
import { Check, AlertCircle, ArrowRight } from "lucide-react";
import { fieldMetadata } from "./fieldMetadata";

interface MappingInterfaceProps {
  columns: string[];
  mapping: Record<string, string>;
  onMappingChange: (targetField: string, sourceColumn: string) => void;
  mode: "basic" | "advanced";
}

function MappingInterface({ columns, mapping, onMappingChange, mode }: MappingInterfaceProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [autoMappingSuggestions, setAutoMappingSuggestions] = useState<Record<string, string>>({});
  
  // Generate auto-mapping suggestions when columns change
  useEffect(() => {
    if (columns.length > 0) {
      const suggestions: Record<string, string> = {};
      
      // Simple string matching for suggestions
      Object.keys(fieldMetadata).forEach(fieldKey => {
        const field = fieldMetadata[fieldKey];
        const normalizedLabel = field.label.toLowerCase();
        
        // Find best matching column
        const matchingColumn = columns.find(col => {
          const normalizedCol = col.toLowerCase();
          return normalizedCol.includes(normalizedLabel) || 
                 normalizedLabel.includes(normalizedCol) ||
                 normalizedCol.includes(fieldKey.toLowerCase());
        });
        
        if (matchingColumn) {
          suggestions[fieldKey] = matchingColumn;
        }
      });
      
      setAutoMappingSuggestions(suggestions);
    }
  }, [columns]);

  // Apply auto-mapping
  const applyAutoMapping = () => {
    Object.entries(autoMappingSuggestions).forEach(([fieldKey, column]) => {
      onMappingChange(fieldKey, column);
    });
  };

  // Filter fields based on search query and mode
  const filteredFields = Object.keys(fieldMetadata).filter(fieldKey => {
    const field = fieldMetadata[fieldKey];
    const searchMatch = searchQuery === "" || 
                      fieldKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      field.label.toLowerCase().includes(searchQuery.toLowerCase());
    
    // In basic mode, only show key fields
    if (mode === "basic") {
      return searchMatch && field.badge === "clé";
    }
    
    return searchMatch;
  });

  // Handle drag and drop
  const handleDragStart = (column: string) => {
    setDraggedColumn(column);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("bg-blue-50");
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("bg-blue-50");
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, fieldKey: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-blue-50");
    
    if (draggedColumn) {
      onMappingChange(fieldKey, draggedColumn);
    }
  };

  return (
    <div>
      {/* Auto-mapping Section */}
      {Object.keys(autoMappingSuggestions).length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-blue-800">Suggested Mappings</h4>
            <button
              onClick={applyAutoMapping}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Apply All Suggestions
            </button>
          </div>
          <p className="text-sm text-blue-700 mb-2">
            We found {Object.keys(autoMappingSuggestions).length} potential column matches
          </p>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search fields..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Columns for drag-and-drop */}
      <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
        <h4 className="font-medium mb-2">Available Columns</h4>
        <div className="flex flex-wrap gap-2">
          {columns.map(column => (
            <div
              key={column}
              className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm cursor-move"
              draggable
              onDragStart={() => handleDragStart(column)}
            >
              {column}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Drag columns onto fields to map them or use the dropdowns
        </p>
      </div>

      {/* Mapping Fields */}
      <div className="space-y-3">
        {filteredFields.map(fieldKey => (
          <div
            key={fieldKey}
            className={`p-3 border rounded-md transition-colors ${
              mapping[fieldKey] ? 'border-green-300 bg-green-50' : 'border-gray-200'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, fieldKey)}
          >
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{fieldMetadata[fieldKey].label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  fieldMetadata[fieldKey].badge === "clé" 
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {fieldMetadata[fieldKey].badge}
                </span>
              </div>
              {mapping[fieldKey] && (
                <Check className="h-4 w-4 text-green-500" />
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              {fieldMetadata[fieldKey].description}
            </p>
            
            <div className="flex items-center gap-2">
              <select
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={mapping[fieldKey] || ""}
                onChange={(e) => onMappingChange(fieldKey, e.target.value)}
              >
                <option value="">-- Select column --</option>
                {columns.map(column => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
              
              {autoMappingSuggestions[fieldKey] && !mapping[fieldKey] && (
                <button
                  onClick={() => onMappingChange(fieldKey, autoMappingSuggestions[fieldKey])}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center gap-1"
                  title="Apply suggestion"
                >
                  <span className="text-sm">Suggest: {autoMappingSuggestions[fieldKey]}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
            
            {fieldMetadata[fieldKey].badge === "clé" && !mapping[fieldKey] && (
              <div className="mt-1 flex items-center gap-1 text-amber-700 text-xs">
                <AlertCircle className="h-3 w-3" />
                <span>This is a key field for data enrichment</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MappingInterface;