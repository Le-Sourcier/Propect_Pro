import React from "react";
import { FileSpreadsheet, FileDown } from "lucide-react";
import { exportToExcel, exportToCSV } from "../../utils/exportUtils";
import { SelectedScrapingJobResult } from "../../types/jobsInterface";

interface ExportButtonsProps {
  data: SelectedScrapingJobResult[];
  fileName?: string;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({
  data,
  fileName = "export",
}) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => exportToExcel(data, fileName)}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        XLSX
      </button>
      <button
        onClick={() => exportToCSV(data, fileName)}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <FileDown className="h-4 w-4 mr-2" />
        CSV
      </button>
    </div>
  );
};

export default ExportButtons;
