import React from "react";
import { isColumnEmpty, getValueByKey } from "../../utils/tableUtils";
import {
  ColumnConfig,
  SelectedScrapingJobResult,
} from "../../interface/jobsInterface";

interface ResultsTableProps {
  data: SelectedScrapingJobResult[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ data }) => {
  // Column definitions with key path and display label
  const allColumns: ColumnConfig[] = [
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
    {
      key: "stars",
      label: "Note",
      accessor: (item) => (item.stars ? `${item.stars} ⭐` : "-"),
    },
  ];

  // Filter out columns that are completely empty
  const visibleColumns = allColumns.filter(
    (column) => !isColumnEmpty(data, column.key)
  );

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {visibleColumns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {visibleColumns.map((column) => (
                <td
                  key={`${idx}-${column.key}`}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                >
                  {column.accessor
                    ? column.accessor(item)
                    : getValueByKey(item, column.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
