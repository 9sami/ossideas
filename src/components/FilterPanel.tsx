import React from 'react';
import { X, Sliders } from 'lucide-react';
import { FilterOptions } from '../types';

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange }) => {
  const categories = [
    'AI/ML', 'DevTools', 'SaaS', 'E-commerce', 'Data Analytics', 
    'Security', 'Mobile', 'Web Dev', 'IoT', 'Blockchain'
  ];

  const licenses = ['MIT', 'Apache', 'GPL', 'BSD', 'ISC', 'Other'];

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleLicenseToggle = (license: string) => {
    const newLicenses = filters.license.includes(license)
      ? filters.license.filter(l => l !== license)
      : [...filters.license, license];
    
    onFilterChange({ ...filters, license: newLicenses });
  };

  const clearAllFilters = () => {
    onFilterChange({
      categories: [],
      opportunityScore: [0, 100],
      license: [],
      isNew: false,
      isTrending: false,
      communityPick: false
    });
  };

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.license.length > 0 ||
    filters.isNew ||
    filters.isTrending ||
    filters.communityPick ||
    filters.opportunityScore[0] > 0 ||
    filters.opportunityScore[1] < 100;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Sliders className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Categories */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Categories</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {categories.map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Opportunity Score */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Opportunity Score</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{filters.opportunityScore[0]}</span>
              <span>{filters.opportunityScore[1]}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={filters.opportunityScore[0]}
              onChange={(e) => onFilterChange({
                ...filters,
                opportunityScore: [parseInt(e.target.value), filters.opportunityScore[1]]
              })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-orange"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={filters.opportunityScore[1]}
              onChange={(e) => onFilterChange({
                ...filters,
                opportunityScore: [filters.opportunityScore[0], parseInt(e.target.value)]
              })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-orange"
            />
          </div>
        </div>

        {/* License */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">License</h4>
          <div className="space-y-1">
            {licenses.map((license) => (
              <label key={license} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.license.includes(license)}
                  onChange={() => handleLicenseToggle(license)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700">{license}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Special Filters */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Special</h4>
          <div className="space-y-1">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.isNew}
                onChange={(e) => onFilterChange({ ...filters, isNew: e.target.checked })}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700">New Arrivals</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.isTrending}
                onChange={(e) => onFilterChange({ ...filters, isTrending: e.target.checked })}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700">Trending</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.communityPick}
                onChange={(e) => onFilterChange({ ...filters, communityPick: e.target.checked })}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700">Community Pick</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;