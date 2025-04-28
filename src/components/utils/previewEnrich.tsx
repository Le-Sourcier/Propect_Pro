import React from "react";
import { Upload } from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

function PreviewEnrich({
  ...props
}: {
  file?: File;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
}) {
  const [dragging, setDragging] = React.useState(false);
  const [fileContent, setFileContent] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!props.file) return;

    const reader = new FileReader();
    const fileName = props.file.name.toLowerCase();

    if (fileName.endsWith(".csv")) {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setFileContent(results.data as any[]);
          },
        });
      };
      reader.readAsText(props.file);
    } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        setFileContent(jsonData as any[]);
      };
      reader.readAsArrayBuffer(props.file);
    }
  }, [props.file]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && props.onChange) {
      const event = {
        target: { files },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      props.onChange(event);
    }
  };

  return (
    <div className="space-y-6">
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center ${
          dragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center">
          <Upload className="h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Drop your file here
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Support for CSV or Excel files with SIRET/SIREN numbers
          </p>
          <div className="mt-4">
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              <Upload className="h-4 w-4 mr-2" />
              Select File
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept=".csv,.xlsx,.xls"
                onChange={props.onChange}
              />
            </label>
          </div>
        </div>
      </div>

      {fileContent.length > 0 && (
        <div className="border rounded p-4 overflow-auto max-h-96">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-white sticky top-0 z-10">
              <tr>
                {Object.keys(fileContent[0]).map((key) => (
                  <th
                    key={key}
                    className="px-3 py-2 text-left font-semibold text-gray-700 border-b"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {fileContent.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, idx) => (
                    <td key={idx} className="px-3 py-2 whitespace-nowrap">
                      {value as string}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PreviewEnrich;
