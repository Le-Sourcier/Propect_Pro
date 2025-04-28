import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { X, Check, Upload, ArrowLeft } from "lucide-react";
import { ReactModal } from "../ui";

interface MappingDialogProps {
  file?: File;
  isOpen: boolean;
  onClose: () => void;
}

interface MappedColumns {
  [key: string]: string;
}

interface CompletionStats {
  [key: string]: number; // % de remplissage par colonne
}

function MappingModule({ ...props }: MappingDialogProps) {
  return (
    <ReactModal
      label={
        <div className="flex items-center">
          <Upload className="w-6 h-6 text-blue-500 mr-1" />
          <span>Mapping du fichier</span>
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
  const [dataSample, setDataSample] = useState<any[]>([]);
  const [mappedColumns, setMappedColumns] = useState<MappedColumns>({
    company_name: "",
    siret: "",
    siren: "",
    domain: "",
    email: "",
    phone: "",
    full_name: "",
    address: "",
    zip_code: "",
    city: "",
    country: "",
    naf_code: "",
    sector: "",
    employee_count: "",
  });

  const [completionStats, setCompletionStats] = useState<CompletionStats>({});
  const [selectedForEnrichment, setSelectedForEnrichment] = useState<string[]>(
    []
  );
  const [step, setStep] = useState<"mapping" | "enrichment">("mapping");

  useEffect(() => {
    if (file) {
      extractColumnsAndData(file);
    }
  }, [file]);

  const extractColumnsAndData = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) return;

      if (file.name.endsWith(".csv")) {
        const parsed = Papa.parse(data as string, { header: true });
        const cols: string[] = parsed.meta.fields || [];
        setColumns(cols);
        setDataSample(parsed.data as any[]);
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        const cols = Object.keys(json[0] || {});
        setColumns(cols);
        setDataSample(json as any[]);
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

  const analyzeCompletion = () => {
    const stats: CompletionStats = {};

    Object.entries(mappedColumns).forEach(([field, mappedCol]) => {
      if (mappedCol && columns.includes(mappedCol)) {
        let filledCount = 0;
        dataSample.forEach((row) => {
          const value = row[mappedCol];
          if (
            value !== null &&
            value !== undefined &&
            String(value).trim() !== ""
          ) {
            filledCount++;
          }
        });
        const total = dataSample.length || 1;
        stats[field] = Math.round((filledCount / total) * 100);
      } else {
        stats[field] = 0;
      }
    });

    setCompletionStats(stats);
  };

  const handleConfirmMapping = () => {
    analyzeCompletion();
    setStep("enrichment");
  };

  const handleBackToMapping = () => {
    setStep("mapping");
  };

  const toggleEnrichmentSelection = (field: string) => {
    setSelectedForEnrichment((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const handleFinalConfirm = () => {
    console.log("Mapping final :", mappedColumns);
    console.log("Colonnes à enrichir :", selectedForEnrichment);
    onClose();
  };

  return (
    <div className="p-6 space-y-6 transition-all duration-500 ease-in-out  overflow-x-hidden">
      <p className="text-gray-600">
        Fichier sélectionné :{" "}
        <span className="font-semibold">{file?.name}</span>
      </p>

      <div
        className={`transition-all duration-500 ease-in-out ${
          step === "mapping"
            ? "opacity-100"
            : "opacity-0 transform translate-x-10"
        }`}
      >
        {step === "mapping" && (
          <>
            <div className="flex flex-wrap gap-6 ">
              {Object.keys(mappedColumns).map((field) => (
                <div
                  key={field}
                  className="w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.5rem)] transition-all duration-300 ease-in-out transform hover:scale-105"
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
                onClick={handleConfirmMapping}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Check className="w-4 h-4 mr-2" />
                Confirmer le Mapping
              </button>
            </div>
          </>
        )}
      </div>

      <div
        className={`transition-all duration-500 ease-in-out ${
          step === "enrichment"
            ? "opacity-100"
            : "opacity-0 transform translate-x-10"
        }`}
      >
        {step === "enrichment" && (
          <>
            <h3 className="text-lg font-semibold mb-4">
              Sélectionnez les colonnes à enrichir :
            </h3>
            <div className="space-y-4">
              {Object.entries(completionStats).map(([field, percentage]) => (
                <div key={field} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={
                      percentage === 100 ||
                      selectedForEnrichment.includes(field)
                    }
                    onChange={() => toggleEnrichmentSelection(field)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-300 ease-in-out transform hover:scale-105"
                  />
                  <label className="ml-3 block text-sm text-gray-700">
                    {fieldMetadata[field]?.label || field} —{" "}
                    {percentage === 0
                      ? "Colonne absente"
                      : `${percentage}% de données existantes`}
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleBackToMapping}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </button>

              <button
                onClick={handleFinalConfirm}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Check className="w-4 h-4 mr-2" />
                Confirmer l'Enrichissement
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const fieldMetadata: {
  [key: string]: {
    label: string;
    badge: string;
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
    label: "Domaine",
    badge: "secondaire",
    description: "Le domaine principal de l'entreprise.",
  },
  email: {
    label: "Adresse e-mail",
    badge: "secondaire",
    description: "Adresse e-mail principale de contact.",
  },
  phone: {
    label: "Numéro de téléphone",
    badge: "secondaire",
    description: "Numéro de téléphone principal pour joindre l'entreprise.",
  },
  full_name: {
    label: "Nom complet",
    badge: "secondaire",
    description: "Nom complet du responsable.",
  },
  address: {
    label: "Adresse",
    badge: "secondaire",
    description: "Adresse physique de l'entreprise.",
  },
  zip_code: {
    label: "Code postal",
    badge: "secondaire",
    description: "Code postal pour la localisation de l'entreprise.",
  },
  city: {
    label: "Ville",
    badge: "secondaire",
    description: "Ville où l'entreprise est située.",
  },
  country: {
    label: "Pays",
    badge: "secondaire",
    description: "Pays de localisation de l'entreprise.",
  },
  naf_code: {
    label: "Code NAF",
    badge: "secondaire",
    description: "Code d'activité économique de l'entreprise.",
  },
  sector: {
    label: "Secteur d'activité",
    badge: "secondaire",
    description: "Secteur d'activité principal de l'entreprise.",
  },
  employee_count: {
    label: "Nombre d'employés",
    badge: "secondaire",
    description: "Nombre d'employés travaillant dans l'entreprise.",
  },
};

export default MappingModule;
