import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import IdeaDetail from './components/IdeaDetail';
import UserProfile from './components/UserProfile';
import { IdeaData } from './types';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'detail' | 'profile'>('home');
  const [selectedIdea, setSelectedIdea] = useState<IdeaData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleIdeaSelect = (idea: IdeaData) => {
    setSelectedIdea(idea);
    setCurrentView('detail');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedIdea(null);
  };

  const handleProfileView = () => {
    setCurrentView('profile');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterOpen={filterOpen}
        onFilterToggle={() => setFilterOpen(!filterOpen)}
        onProfileClick={handleProfileView}
        onLogoClick={handleBackToHome}
        isLoggedIn={isLoggedIn}
        onLoginToggle={() => setIsLoggedIn(!isLoggedIn)}
      />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          currentView={currentView}
          onNavigate={setCurrentView}
          onHomeClick={handleBackToHome}
        />
        
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
          {currentView === 'home' && (
            <MainContent 
              searchQuery={searchQuery}
              filterOpen={filterOpen}
              onIdeaSelect={handleIdeaSelect}
              isLoggedIn={isLoggedIn}
            />
          )}
          
          {currentView === 'detail' && selectedIdea && (
            <IdeaDetail 
              idea={selectedIdea}
              onBack={handleBackToHome}
            />
          )}
          
          {currentView === 'profile' && (
            <UserProfile 
              onIdeaSelect={handleIdeaSelect}
              isLoggedIn={isLoggedIn}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;