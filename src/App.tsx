import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-dom';
import { AuthProvider } from './components/AuthProvider';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import IdeaDetail from './components/IdeaDetail';
import UserProfile from './components/UserProfile';
import AuthCallback from './components/AuthCallback';
import AuthModal from './components/AuthModal';
import { useAuth } from './hooks/useAuth';
import { IdeaData } from './types';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'detail' | 'profile'>('home');
  const [selectedIdea, setSelectedIdea] = useState<IdeaData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const { authState, logout } = useAuth();
  const isLoggedIn = !!authState.user;

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

  const handleLoginClick = () => {
    setAuthModalMode('login');
    setAuthModalOpen(true);
  };

  const handleRegisterClick = () => {
    setAuthModalMode('register');
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
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
        onLoginClick={handleLoginClick}
        onLogoutClick={handleLogout}
        user={authState.user}
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
              onRegisterClick={handleRegisterClick}
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
              onLoginClick={handleLoginClick}
              user={authState.user}
            />
          )}
        </main>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </div>
  );
};

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </Router>
  );
}

export default App;