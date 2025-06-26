import React from 'react';
import { X, Sliders, Check } from 'lucide-react';
import { FilterOptions } from '../types';

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  isOpen: boolean;
  onClose: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, isOpen, onClose }) => {
  const categories = [
    'AI/ML', 'DevTools', 'SaaS', 'E-commerce', 'Data Analytics', 
    'Security', 'Mobile', 'Web Dev', 'IoT', 'Blockchain'
  ];

  const licenses = ['MIT', 'Apache', 'GPL', 'BSD', 'ISC', 'Other'];

  const sections = [
    { id: 'trending', label: 'Trending Ideas', icon: '🔥' },
    { id: 'community', label: 'Community Picks', icon: '👥' },
    { id: 'newArrivals', label: 'New Arrivals', icon: '✨' },
    { id: 'personalized', label: 'Personalized', icon: '🎯' },
    { id: 'discovery', label: 'Main Discovery', icon: '🔍' }
  ];

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

  const handleSectionToggle = (sectionId: string) => {
    const currentSections = filters.appliedSections || [];
    const newSections = currentSections.includes(sectionId)
      ? currentSections.filter(s => s !== sectionId)
      : [...currentSections, sectionId];
    
    onFilterChange({ ...filters, appliedSections: newSections });
  };

  const clearAllFilters = () => {
    onFilterChange({
      categories: [],
      opportunityScore: [0, 100],
      license: [],
      isNew: false,
      isTrending: false,
      communityPick: false,
      appliedSections: ['trending', 'community', 'newArrivals', 'personalized', 'discovery']
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

  if (!isOpen) return null;

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Row */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Sliders className="h-4 w-4 text-orange-500" />
            <h3 className="text-sm font-semibold text-gray-900">Advanced Filters</h3>
            <div className="flex items-center space-x-1 ml-4">
              <Check className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600 font-medium">Live</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-600">
              {hasActiveFilters ? 'Filters active' : 'No filters applied'}
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-orange-600 hover:text-orange-700 font-medium px-2 py-1 rounded hover:bg-orange-50 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filters Content */}
        <div className="py-4">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            {/* Apply to Sections */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-semibold text-gray-900 mb-2 flex items-center uppercase tracking-wide">
                <span className="mr-1">🎯</span>
                Apply To Sections
              </h4>
              <div className="grid grid-cols-2 gap-1">
                {sections.map((section) => (
                  <label key={section.id} className="flex items-center py-1 px-2 rounded hover:bg-gray-50 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={(filters.appliedSections || []).includes(section.id)}
                      onChange={() => handleSectionToggle(section.id)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 focus:ring-1 w-3 h-3 mr-2 flex-shrink-0"
                    />
                    <span className="text-xs mr-1">{section.icon}</span>
                    <span className="text-xs text-gray-700 group-hover:text-gray-900 truncate">{section.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-semibold text-gray-900 mb-2 flex items-center uppercase tracking-wide">
                <span className="mr-1">📂</span>
                Categories
              </h4>
              <div className="grid grid-cols-2 gap-1 max-h-24 overflow-y-auto">
                {categories.map((category) => (
                  <label key={category} className="flex items-center py-1 px-2 rounded hover:bg-gray-50 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 focus:ring-1 w-3 h-3 mr-2 flex-shrink-0"
                    />
                    <span className="text-xs text-gray-700 group-hover:text-gray-900 truncate">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Opportunity Score */}
            <div>
              <h4 className="text-xs font-semibold text-gray-900 mb-2 flex items-center uppercase tracking-wide">
                <span className="mr-1">⚡</span>
                Score Range
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span className="font-medium">{filters.opportunityScore[0]}</span>
                  <span className="font-medium">{filters.opportunityScore[1]}</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.opportunityScore[0]}
                    onChange={(e) => onFilterChange({
                      ...filters,
                      opportunityScore: [parseInt(e.target.value), filters.opportunityScore[1]]
                    })}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-orange"
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
                    className="absolute top-0 w-full h-1.5 bg-transparent rounded-lg appearance-none cursor-pointer slider-thumb-orange"
                  />
                </div>
              </div>
            </div>

            {/* License */}
            <div>
              <h4 className="text-xs font-semibold text-gray-900 mb-2 flex items-center uppercase tracking-wide">
                <span className="mr-1">📄</span>
                License
              </h4>
              <div className="grid grid-cols-2 gap-1">
                {licenses.map((license) => (
                  <label key={license} className="flex items-center py-1 px-2 rounded hover:bg-gray-50 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.license.includes(license)}
                      onChange={() => handleLicenseToggle(license)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 focus:ring-1 w-3 h-3 mr-2 flex-shrink-0"
                    />
                    <span className="text-xs text-gray-700 group-hover:text-gray-900">{license}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Special Filters */}
            <div>
              <h4 className="text-xs font-semibold text-gray-900 mb-2 flex items-center uppercase tracking-wide">
                <span className="mr-1">⭐</span>
                Special
              </h4>
              <div className="space-y-1">
                <label className="flex items-center py-1 px-2 rounded hover:bg-gray-50 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.isNew}
                    onChange={(e) => onFilterChange({ ...filters, isNew: e.target.checked })}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 focus:ring-1 w-3 h-3 mr-2 flex-shrink-0"
                  />
                  <span className="text-xs mr-1">✨</span>
                  <span className="text-xs text-gray-700 group-hover:text-gray-900">New</span>
                </label>
                <label className="flex items-center py-1 px-2 rounded hover:bg-gray-50 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.isTrending}
                    onChange={(e) => onFilterChange({ ...filters, isTrending: e.target.checked })}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 focus:ring-1 w-3 h-3 mr-2 flex-shrink-0"
                  />
                  <span className="text-xs mr-1">🔥</span>
                  <span className="text-xs text-gray-700 group-hover:text-gray-900">Trending</span>
                </label>
                <label className="flex items-center py-1 px-2 rounded hover:bg-gray-50 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.communityPick}
                    onChange={(e) => onFilterChange({ ...filters, communityPick: e.target.checked })}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 focus:ring-1 w-3 h-3 mr-2 flex-shrink-0"
                  />
                  <span className="text-xs mr-1">👥</span>
                  <span className="text-xs text-gray-700 group-hover:text-gray-900">Community</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;