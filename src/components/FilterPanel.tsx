import React from 'react';
import { X, Sliders, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { FilterOptions } from '../types';

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  isOpen: boolean;
  onClose: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, isOpen, onClose }) => {
  const [expandedSection, setExpandedSection] = React.useState<string | null>(null);

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

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      {/* Main Filter Bar */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Sliders className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-green-600">Live filtering</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium px-3 py-1 rounded-lg hover:bg-orange-50 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filter Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {/* Apply to Sections */}
          <div className="lg:col-span-2">
            <button
              onClick={() => toggleSection('sections')}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span>🎯</span>
                <span className="font-medium text-gray-900">Apply Filters To</span>
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                  {(filters.appliedSections || []).length}
                </span>
              </div>
              {expandedSection === 'sections' ? 
                <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                <ChevronDown className="h-4 w-4 text-gray-500" />
              }
            </button>
            {expandedSection === 'sections' && (
              <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
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
            )}
          </div>

          {/* Categories */}
          <div>
            <button
              onClick={() => toggleSection('categories')}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span>📂</span>
                <span className="font-medium text-gray-900">Categories</span>
                {filters.categories.length > 0 && (
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                    {filters.categories.length}
                  </span>
                )}
              </div>
              {expandedSection === 'categories' ? 
                <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                <ChevronDown className="h-4 w-4 text-gray-500" />
              }
            </button>
            {expandedSection === 'categories' && (
              <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
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
            )}
          </div>

          {/* Opportunity Score */}
          <div>
            <button
              onClick={() => toggleSection('score')}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span>⚡</span>
                <span className="font-medium text-gray-900">Score</span>
                {(filters.opportunityScore[0] > 0 || filters.opportunityScore[1] < 100) && (
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                    {filters.opportunityScore[0]}-{filters.opportunityScore[1]}
                  </span>
                )}
              </div>
              {expandedSection === 'score' ? 
                <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                <ChevronDown className="h-4 w-4 text-gray-500" />
              }
            </button>
            {expandedSection === 'score' && (
              <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
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
            )}
          </div>

          {/* License */}
          <div>
            <button
              onClick={() => toggleSection('license')}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span>📄</span>
                <span className="font-medium text-gray-900">License</span>
                {filters.license.length > 0 && (
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                    {filters.license.length}
                  </span>
                )}
              </div>
              {expandedSection === 'license' ? 
                <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                <ChevronDown className="h-4 w-4 text-gray-500" />
              }
            </button>
            {expandedSection === 'license' && (
              <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
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
            )}
          </div>

          {/* Special Filters */}
          <div>
            <button
              onClick={() => toggleSection('special')}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span>⭐</span>
                <span className="font-medium text-gray-900">Special</span>
                {(filters.isNew || filters.isTrending || filters.communityPick) && (
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                    {[filters.isNew, filters.isTrending, filters.communityPick].filter(Boolean).length}
                  </span>
                )}
              </div>
              {expandedSection === 'special' ? 
                <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                <ChevronDown className="h-4 w-4 text-gray-500" />
              }
            </button>
            {expandedSection === 'special' && (
              <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
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
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col space-y-2">
            <div className="text-sm text-gray-600 mb-2">Quick Actions</div>
            <button
              onClick={() => onFilterChange({ ...filters, isNew: true, isTrending: true })}
              className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              🚀 Hot & New
            </button>
            <button
              onClick={() => onFilterChange({ ...filters, categories: ['AI/ML', 'DevTools'] })}
              className="px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
            >
              🤖 AI & Dev
            </button>
            <button
              onClick={() => onFilterChange({ ...filters, opportunityScore: [80, 100] })}
              className="px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              ⭐ High Score
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;