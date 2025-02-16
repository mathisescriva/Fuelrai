import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

interface AuthContextType {
  user: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // Vérifie l'authentification au chargement
    if (authService.isAuthenticated()) {
      setUser('elixir@fuelrai.com');
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login(username, password);
      setUser(response.user);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Erreur de connexion');
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: authService.isAuthenticated()
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};
