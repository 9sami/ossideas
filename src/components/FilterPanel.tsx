
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
    <div className="bg-white border-b border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Header Section */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg">
              <Sliders className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
              <div className="flex items-center space-x-2 mt-0.5">
                <div className="flex items-center space-x-1">
                  <Check className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">Live</span>
                </div>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">
                  {hasActiveFilters ? `${filters.categories.length + filters.license.length + (filters.isNew ? 1 : 0) + (filters.isTrending ? 1 : 0) + (filters.communityPick ? 1 : 0)} filters active` : 'No filters applied'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Apply to Sections */}
            <div className="lg:col-span-3">
              <div className="border border-orange-200 rounded-xl p-4 h-full bg-white">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="text-lg mr-2">🎯</span>
                  Apply To Sections
                </h4>
                <div className="space-y-2">
                  {sections.map((section) => (
                    <label key={section.id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors duration-150">
                      <input
                        type="checkbox"
                        checked={(filters.appliedSections || []).includes(section.id)}
                        onChange={() => handleSectionToggle(section.id)}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 focus:ring-2 w-4 h-4 mr-3 flex-shrink-0"
                      />
                      <span className="text-base mr-2">{section.icon}</span>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">{section.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="lg:col-span-3">
              <div className="border border-orange-200 rounded-xl p-4  bg-white">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="text-lg mr-2">📂</span>
                  Categories
                </h4>
                <div className="grid grid-cols-1 gap-2 overflow-y-auto custom-scrollbar relative  max-h-64">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors duration-150">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 focus:ring-2 w-4 h-4 mr-3 flex-shrink-0"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Opportunity Score & License */}
            <div className="lg:col-span-3 space-y-4">
              {/* Opportunity Score */}
              <div className="border border-orange-200 rounded-xl p-4 bg-white">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="text-lg mr-2">⚡</span>
                  Opportunity Score
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600 bg-gray-50 px-2 py-1 rounded">{filters.opportunityScore[0]}</span>
                    <span className="text-xs text-gray-500">to</span>
                    <span className="text-sm font-semibold text-gray-600 bg-gray-50 px-2 py-1 rounded">{filters.opportunityScore[1]}</span>
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
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-orange"
                    />
                  </div>
                </div>
              </div>

              {/* License */}
              <div className="border border-orange-200 rounded-xl p-4 bg-white">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="text-lg mr-2">📄</span>
                  License Type
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {licenses.map((license) => (
                    <label key={license} className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors duration-150">
                      <input
                        type="checkbox"
                        checked={filters.license.includes(license)}
                        onChange={() => handleLicenseToggle(license)}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 focus:ring-2 w-4 h-4 mr-2 flex-shrink-0"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">{license}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Special Filters */}
            <div className="lg:col-span-3">
              <div className="border border-orange-200 rounded-xl p-4 bg-white">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="text-lg mr-2">⭐</span>
                  Special Filters
                </h4>
                <div className="space-y-3 max-h-64">
                  <label className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors duration-150 border-2 border-transparent hover:border-orange-200">
                    <input
                      type="checkbox"
                      checked={filters.isNew}
                      onChange={(e) => onFilterChange({ ...filters, isNew: e.target.checked })}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 focus:ring-2 w-4 h-4 mr-3 flex-shrink-0"
                    />
                    <span className="text-lg mr-2">✨</span>
                    <div>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium block">New Releases</span>
                      <span className="text-xs text-gray-500">Recently added</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors duration-150 border-2 border-transparent hover:border-orange-200">
                    <input
                      type="checkbox"
                      checked={filters.isTrending}
                      onChange={(e) => onFilterChange({ ...filters, isTrending: e.target.checked })}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 focus:ring-2 w-4 h-4 mr-3 flex-shrink-0"
                    />
                    <span className="text-lg mr-2">🔥</span>
                    <div>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium block">Trending Now</span>
                      <span className="text-xs text-gray-500">Popular this week</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors duration-150 border-2 border-transparent hover:border-orange-200">
                    <input
                      type="checkbox"
                      checked={filters.communityPick}
                      onChange={(e) => onFilterChange({ ...filters, communityPick: e.target.checked })}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 focus:ring-2 w-4 h-4 mr-3 flex-shrink-0"
                    />
                    <span className="text-lg mr-2">👥</span>
                    <div>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium block">Community Choice</span>
                      <span className="text-xs text-gray-500">Highly rated</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
