import React from "react";
import { Filter, Search } from "lucide-react";

interface SearchFilterProps {
  onSearch: (term: string) => void;
  onFilterClick: () => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearch,
  onFilterClick,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
      <div className="relative rounded-md w-full sm:w-64">
        <input
          type="text"
          className="block w-full rounded-md border border-gray-300 pr-10 py-2 px-3 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Search results..."
          onChange={handleSearchChange}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      <button
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        onClick={onFilterClick}
      >
        <Filter className="h-4 w-4 mr-2" />
        Filter
      </button>
    </div>
  );
};

export default SearchFilter;
