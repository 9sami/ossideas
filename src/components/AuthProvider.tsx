import React, { ReactNode } from 'react';
import { AuthContext, useAuthLogic } from '../hooks/useAuth';
import LoadingOverlay from './LoadingOverlay';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const authLogic = useAuthLogic();

  return (
    <AuthContext.Provider value={authLogic}>
      <LoadingOverlay 
        isLoading={authLogic.authState.loading} 
        text="Loading your session..." 
      />
      {children}
    </AuthContext.Provider>
  );
};