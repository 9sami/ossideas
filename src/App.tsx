import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import { AuthProvider } from './components/AuthProvider';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import IdeaDetail from './components/IdeaDetail';
import UserProfile from './components/UserProfile';
import PricingPage from './components/PricingPage';
import SuccessPage from './components/SuccessPage';
import AuthCallback from './components/AuthCallback';
import AuthModal from './components/AuthModal';
import { useAuth } from './hooks/useAuth';
import { IdeaData } from './types';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'detail' | 'profile' | 'pricing'>('home');
  const [selectedIdea, setSelectedIdea] = useState<IdeaData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'onboarding'>('login');

  const { authState, logout } = useAuth();
  const isLoggedIn = !!authState.user;

  // Check for onboarding requirement after login
  useEffect(() => {
    if (authState.onboardingRequired && !authState.loading && isLoggedIn) {
      setAuthModalMode('onboarding');
      setAuthModalOpen(true);
    }
  }, [authState.onboardingRequired, authState.loading, isLoggedIn]);

  // Show loading spinner while auth state is initializing
  if (authState.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

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

  const handlePricingView = () => {
    setCurrentView('pricing');
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

  const handleAuthModalClose = () => {
    // Allow closing the modal unless onboarding is required
    if (!authState.onboardingRequired || authModalMode !== 'onboarding') {
      setAuthModalOpen(false);
    }
  };

  const handleNavigate = (view: 'home' | 'detail' | 'profile' | 'pricing') => {
    setCurrentView(view);
    if (view === 'home') {
      setSelectedIdea(null);
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
          onNavigate={handleNavigate}
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

          {currentView === 'pricing' && (
            <PricingPage />
          )}
        </main>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={handleAuthModalClose}
        initialMode={authModalMode}
      />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;