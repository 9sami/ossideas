import React, { useEffect, useRef } from 'react';
import { 
  Home, 
  Grid3X3, 
  Heart, 
  Users, 
  Plus, 
  Settings, 
  Menu, 
  X,
  CreditCard
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  currentView: string;
  onNavigate: (view: 'home' | 'detail' | 'profile' | 'pricing') => void;
  onHomeClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  onClose,
  currentView,
  onNavigate,
  onHomeClick
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home', onClick: onHomeClick },
    { id: 'categories', icon: Grid3X3, label: 'Categories', onClick: () => {} },
    { id: 'saved', icon: Heart, label: 'Saved Ideas', onClick: () => onNavigate('profile') },
    { id: 'community', icon: Users, label: 'Community', onClick: () => {} },
    { id: 'pricing', icon: CreditCard, label: 'Pricing', onClick: () => onNavigate('pricing') },
    { id: 'submit', icon: Plus, label: 'Submit Idea', onClick: () => {}, premium: true },
    { id: 'settings', icon: Settings, label: 'Settings', onClick: () => {} },
  ];

  // Handle click outside to close sidebar when open
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay - covers everything including sticky headers */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64' : 'w-16'
        }`}
      >
        {/* Header spacer to account for fixed header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-center flex-shrink-0">
          <button
            onClick={onToggle}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-orange-500 transition-colors"
            title={isOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="px-2 py-4 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={item.onClick}
                    className={`w-full h-12 flex items-center rounded-lg transition-all duration-200 relative overflow-hidden ${
                      isActive
                        ? 'bg-orange-50 text-orange-600 border border-orange-200'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-orange-500'
                    } ${isOpen ? 'px-3' : 'px-2 justify-center'}`}
                  >
                    {/* Icon container - fixed position and size */}
                    <div className={`flex items-center justify-center w-5 h-5 flex-shrink-0 ${
                      isOpen ? '' : 'mx-auto'
                    }`}>
                      <Icon className={`h-5 w-5 transition-colors duration-200 ${
                        isActive ? 'text-orange-500' : ''
                      }`} />
                    </div>
                    
                    {/* Label container - animated width and opacity */}
                    <div className={`flex items-center justify-between flex-1 min-w-0 ml-3 transition-all duration-300 ${
                      isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'
                    }`}>
                      <span className="font-medium truncate whitespace-nowrap">
                        {item.label}
                      </span>
                      
                      {/* Pro Badge */}
                      {item.premium && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-orange-100 text-orange-600 rounded-full flex-shrink-0 whitespace-nowrap">
                          Pro
                        </span>
                      )}
                    </div>
                  </button>
                  
                  {/* Tooltip for closed state */}
                  {!isOpen && (
                    <div className={`absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-50 transition-all duration-200 ${
                      isOpen ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      {item.label}
                      {item.premium && (
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-orange-500 text-white rounded">
                          Pro
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;