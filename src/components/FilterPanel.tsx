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
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Filter Overlay */}
      <div className="fixed top-20 right-6 w-96 max-h-[calc(100vh-6rem)] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <Sliders className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          </div>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(100vh-12rem)]">
          <div className="p-4 space-y-6">
            {/* Apply to Sections */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <span className="mr-2">🎯</span>
                Apply Filters To
              </h4>
              <div className="space-y-2">
                {sections.map((section) => (
                  <label key={section.id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(filters.appliedSections || []).includes(section.id)}
                      onChange={() => handleSectionToggle(section.id)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-3"
                    />
                    <span className="mr-2">{section.icon}</span>
                    <span className="text-sm text-gray-700">{section.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <span className="mr-2">📂</span>
                Categories
              </h4>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {categories.map((category) => (
                  <label key={category} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-2"
                    />
                    <span className="text-gray-700 truncate">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Opportunity Score */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <span className="mr-2">⚡</span>
                Opportunity Score
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{filters.opportunityScore[0]}</span>
                  <span>{filters.opportunityScore[1]}</span>
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
                    className="absolute top-0 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-orange"
                  />
                </div>
              </div>
            </div>

            {/* License */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <span className="mr-2">📄</span>
                License
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {licenses.map((license) => (
                  <label key={license} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={filters.license.includes(license)}
                      onChange={() => handleLicenseToggle(license)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-2"
                    />
                    <span className="text-gray-700">{license}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Special Filters */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <span className="mr-2">⭐</span>
                Special
              </h4>
              <div className="space-y-2">
                <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.isNew}
                    onChange={(e) => onFilterChange({ ...filters, isNew: e.target.checked })}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-3"
                  />
                  <span className="mr-2">✨</span>
                  <span className="text-sm text-gray-700">New Arrivals</span>
                </label>
                <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.isTrending}
                    onChange={(e) => onFilterChange({ ...filters, isTrending: e.target.checked })}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-3"
                  />
                  <span className="mr-2">🔥</span>
                  <span className="text-sm text-gray-700">Trending</span>
                </label>
                <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.communityPick}
                    onChange={(e) => onFilterChange({ ...filters, communityPick: e.target.checked })}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-3"
                  />
                  <span className="mr-2">👥</span>
                  <span className="text-sm text-gray-700">Community Pick</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {hasActiveFilters ? 'Filters active' : 'No filters applied'}
            </span>
            <div className="flex items-center space-x-1">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-green-600">Live filtering</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;