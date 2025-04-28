import React, { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { X, Check, Upload } from "lucide-react";
import { ReactModal } from "../ui";

interface MappingDialogProps {
  file?: File;
  isOpen: boolean;
  onClose: () => void;
}

function MappingModule({ ...props }: MappingDialogProps) {
  return (
    <ReactModal
      label={
        <div className="flex items-center">
          <Upload className="w-6 h-6 text-blue-500 mr-1 " />
          <span> Mapping du fichier</span>
        </div>
      }
      isOpen={props.isOpen}
      onClose={props.onClose}
      className=""
    >
      <MappingDialogHelper file={props.file} onClose={props.onClose} />
    </ReactModal>
  );
}

function MappingDialogHelper({
  file,
  onClose,
}: {
  file: File | undefined;
  onClose: () => void;
}) {
  const [columns, setColumns] = useState<string[]>([]);
  interface MappedColumns {
    [key: string]: string; // Allow indexing with string keys
  }

  const [mappedColumns, setMappedColumns] = useState<MappedColumns>({
    company_name: "",
    siret: "",
    siren: "",
    domain: "",
    phone: "",
    address: "",
    naf_code: "",
    zip_code: "",
  });

  React.useEffect(() => {
    if (file) {
      extractColumns(file);
    }
  }, [file]);

  const extractColumns = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) {
        console.error("Failed to read file: event target is null.");
        return;
      }

      if (file.name.endsWith(".csv")) {
        const parsed = Papa.parse(data as string, { header: true });
        const cols: string[] = parsed.meta.fields || [];
        setColumns(cols);
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const cols: string[] = Array.isArray(json[0])
          ? (json[0] as string[])
          : [];
        setColumns(cols);
      }
    };

    if (file.name.endsWith(".csv")) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const handleMappingChange = (field: string, value: string) => {
    setMappedColumns((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleConfirm = () => {
    console.log("Mapping confirmed:", mappedColumns);
    onClose();
  };

  return (
    <div className="p-6 space-y-6">
      <p className="text-gray-600">
        Fichier sélectionné :{" "}
        <span className="font-semibold">{file?.name}</span>
      </p>

      {/* <div className="space-y-4"> */}
      <div className="flex flex-wrap gap-6">
        {Object.keys(mappedColumns).map((field) => (
          // <div key={field}>
          <div
            key={field}
            className="w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.5rem)] lg:mr-10"
          >
            <label className="block text-sm font-medium text-gray-700">
              {fieldMetadata[field]?.label || field}{" "}
              {fieldMetadata[field]?.badge && (
                <span
                  className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                    fieldMetadata[field].badge === "clé"
                      ? "bg-green-100 text-green-800"
                      : fieldMetadata[field].badge === "secondaire"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {fieldMetadata[field].badge}
                </span>
              )}
            </label>
            {fieldMetadata[field]?.description && (
              <p className="mt-1 text-xs text-gray-500">
                {fieldMetadata[field].description}
              </p>
            )}

            <select
              value={mappedColumns[field]}
              onChange={(e) => handleMappingChange(field, e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 sm:text-sm"
            >
              <option value="">-- Sélectionnez une colonne --</option>
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
        >
          <X className="w-4 h-4 mr-2" />
          Annuler
        </button>

        <button
          onClick={handleConfirm}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Check className="w-4 h-4 mr-2" />
          Confirmer
        </button>
      </div>
    </div>
  );
}

const fieldMetadata: {
  [key: string]: {
    label: string;
    badge: string; // clé, secondaire, optionnel
    description: string;
  };
} = {
  company_name: {
    label: "Nom de l'entreprise",
    badge: "clé",
    description: "Le nom légal de l'entreprise pour l'enrichissement.",
  },
  siret: {
    label: "Numéro SIRET",
    badge: "clé",
    description: "Identifiant unique français de l'établissement.",
  },
  siren: {
    label: "Numéro SIREN",
    badge: "clé",
    description: "Identifiant unique français de l'entreprise (9 chiffres).",
  },
  domain: {
    label: "Domaine web",
    badge: "clé",
    description: "Le domaine internet de l'entreprise (ex: exemple.com).",
  },
  phone: {
    label: "Téléphone",
    badge: "secondaire",
    description: "Numéro de téléphone principal de l'entreprise.",
  },
  address: {
    label: "Adresse",
    badge: "secondaire",
    description: "Adresse postale complète de l'entreprise.",
  },
  naf_code: {
    label: "Code NAF",
    badge: "optionnel",
    description: "Code NAF ou APE (activité principale exercée).",
  },
  zip_code: {
    label: "Code postal",
    badge: "optionnel",
    description: "Code postal de l'entreprise.",
  },
};

export default MappingModule;
