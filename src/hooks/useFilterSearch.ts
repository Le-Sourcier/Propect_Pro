import { useState, useEffect, useMemo } from "react";
import { SelectedScrapingJobResult } from "../components/interface/jobsInterface";

export const useFilterSearch = (
  data: SelectedScrapingJobResult[] | undefined
) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    setSearchTerm("");
  }, [data]);

  const filteredData = useMemo(() => {
    if (!data || !searchTerm.trim()) return data;

    const lowerCaseSearch = searchTerm.toLowerCase();

    return data.filter((item) => {
      const searchableValues = [
        item.nom_entreprise,
        item.dirigeant,
        item.forme_juridique,
        item.categorie_juridique,
        item.type,
        item.siren_number,
        item.code_naf,
        item.siege?.siret,
        item.siege?.adresse_ligne_1,
        item.siege?.code_postal,
        item.siege?.ville,
        item.siege?.pays,
        item.phone_number,
        item.website,
        item.reviews?.toString(),
        item.stars?.toString(),
      ];

      return searchableValues.some(
        (value) =>
          value && value.toString().toLowerCase().includes(lowerCaseSearch)
      );
    });
  }, [data, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  return {
    filteredData,
    searchTerm,
    isFilterOpen,
    handleSearch,
    toggleFilter,
  };
};
