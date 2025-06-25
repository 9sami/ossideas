import React from 'react';
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
  currentView: string;
  onNavigate: (view: 'home' | 'detail' | 'profile' | 'pricing') => void;
  onHomeClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  currentView,
  onNavigate,
  onHomeClick
}) => {
  const menuItems = [
    { id: 'home', icon: Home, label: 'Home', onClick: onHomeClick },
    { id: 'categories', icon: Grid3X3, label: 'Categories', onClick: () => {} },
    { id: 'saved', icon: Heart, label: 'Saved Ideas', onClick: () => onNavigate('profile') },
    { id: 'community', icon: Users, label: 'Community', onClick: () => {} },
    { id: 'pricing', icon: CreditCard, label: 'Pricing', onClick: () => onNavigate('pricing') },
    { id: 'submit', icon: Plus, label: 'Submit Idea', onClick: () => {}, premium: true },
    { id: 'settings', icon: Settings, label: 'Settings', onClick: () => {} },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-50 ${
        isOpen ? 'w-64' : 'w-16'
      }`}>
        {/* Toggle Button */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={onToggle}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-orange-500 transition-colors"
            title={isOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={item.onClick}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors relative ${
                    isActive
                      ? 'bg-orange-50 text-orange-600 border border-orange-200'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-orange-500'
                  }`}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-orange-500' : ''}`} />
                  
                  {/* Label - only show when sidebar is open */}
                  {isOpen && (
                    <span className="font-medium truncate">
                      {item.label}
                    </span>
                  )}
                  
                  {/* Pro Badge - only show when sidebar is open */}
                  {isOpen && item.premium && (
                    <span className="ml-auto px-2 py-0.5 text-xs bg-orange-100 text-orange-600 rounded-full flex-shrink-0">
                      Pro
                    </span>
                  )}
                </button>
                
                {/* Tooltip for closed state */}
                {!isOpen && (
                  <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                    {item.label}
                    {item.premium && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs bg-orange-500 text-white rounded">
                        Pro
                      </span>
                    )}
                    {/* Tooltip arrow */}
                    <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;