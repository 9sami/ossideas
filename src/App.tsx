import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import { AuthProvider } from './components/AuthProvider';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import IdeaDetail from './components/IdeaDetail';
import RepositoryDetail from './components/RepositoryDetail';
import UserProfile from './components/UserProfile';
import PricingPage from './components/PricingPage';
import SuccessPage from './components/SuccessPage';
import AuthCallback from './components/AuthCallback';
import AuthModal from './components/AuthModal';
import ScrollToTop from './components/ScrollToTop';
import { useAuth } from './hooks/useAuth';

const AppContent: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<
    'login' | 'register' | 'onboarding'
  >('login');

  const { authState, logout } = useAuth();
  const isLoggedIn = !!authState.user;

  // Check for onboarding requirement after login
  useEffect(() => {
    if (authState.onboardingRequired && !authState.loading && isLoggedIn) {
      setAuthModalMode('onboarding');
      setAuthModalOpen(true);
    }
  }, [authState.onboardingRequired, authState.loading, isLoggedIn]);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleFilterToggle = () => {
    setFilterOpen(!filterOpen);
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
    await logout();
  };

  const handleCloseAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterOpen={filterOpen}
        onFilterToggle={handleFilterToggle}
        onProfileClick={() => {}}
        onLogoClick={() => {}}
        isLoggedIn={isLoggedIn}
        onLoginClick={handleLoginClick}
        onLogoutClick={handleLogout}
        user={authState.user}
        currentView="home"
      />

      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={handleSidebarToggle}
          onClose={handleCloseSidebar}
          currentView="home"
          onNavigate={() => {}}
          onHomeClick={() => {}}
        />

        {/* Main content with constant left margin for closed sidebar width */}
        <main className="flex-1 ml-16">
          <Routes>
            <Route
              path="/"
              element={
                <MainContent
                  searchQuery={searchQuery}
                  filterOpen={filterOpen}
                  onIdeaSelect={() => {}}
                  isLoggedIn={isLoggedIn}
                  onRegisterClick={handleRegisterClick}
                  onFilterToggle={handleFilterToggle}
                />
              }
            />
            <Route path="/ideas/:id" element={<IdeaDetail />} />
            <Route path="/repositories/:id" element={<RepositoryDetail />} />
            <Route
              path="/profile"
              element={
                <UserProfile
                  onIdeaSelect={() => {}}
                  isLoggedIn={isLoggedIn}
                  onLoginClick={handleLoginClick}
                  user={authState.user}
                />
              }
            />
            <Route path="/pricing" element={<PricingPage />} />
          </Routes>
        </main>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={handleCloseAuthModal}
        initialMode={authModalMode}
      />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
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
