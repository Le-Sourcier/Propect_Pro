import { utils, writeFile } from "xlsx";
import { isColumnEmpty } from "./tableUtils";
import { SelectedScrapingJobResult } from "../types/jobsInterface";

const getColumnDefinitions = (data: SelectedScrapingJobResult[]) => {
  const columns = [
    { key: "nom_entreprise", label: "Nom Entreprise" },
    { key: "dirigeant", label: "Dirigeant" },
    { key: "forme_juridique", label: "Forme Juridique" },
    { key: "categorie_juridique", label: "Catégorie Juridique" },
    { key: "siren_number", label: "SIREN" },
    { key: "code_naf", label: "Code NAF" },
    { key: "siege.siret", label: "SIRET" },
    { key: "siege.adresse_ligne_1", label: "Adresse" },
    { key: "siege.code_postal", label: "Code Postal" },
    { key: "siege.ville", label: "Ville" },
    { key: "siege.pays", label: "Pays" },
    { key: "phone_number", label: "Téléphone" },
    { key: "website", label: "Site Web" },
    { key: "reviews", label: "Avis" },
    { key: "stars", label: "Note" },
  ];

  return columns.filter((col) => !isColumnEmpty(data, col.key));
};

const flattenData = (
  data: SelectedScrapingJobResult[],
  columns: { key: string; label: string }[]
) => {
  return data.map((item) => {
    const flatItem: Record<string, any> = {};

    columns.forEach(({ key, label }) => {
      if (key.includes(".")) {
        const [parent, child] = key.split(".");
        flatItem[label] =
          (
            item[parent as keyof SelectedScrapingJobResult] as Record<
              string,
              any
            >
          )?.[child] || "";
      } else {
        flatItem[label] = item[key as keyof SelectedScrapingJobResult] || "";
      }
    });

    return flatItem;
  });
};

export const exportToExcel = (
  data: SelectedScrapingJobResult[],
  fileName: string = "export"
) => {
  const columns = getColumnDefinitions(data);
  const flattenedData = flattenData(data, columns);

  const worksheet = utils.json_to_sheet(flattenedData);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Data");
  writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToCSV = (
  data: SelectedScrapingJobResult[],
  fileName: string = "export"
) => {
  const columns = getColumnDefinitions(data);
  const flattenedData = flattenData(data, columns);

  const worksheet = utils.json_to_sheet(flattenedData);
  const csvContent = utils.sheet_to_csv(worksheet);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.csv`;
  link.click();
};
