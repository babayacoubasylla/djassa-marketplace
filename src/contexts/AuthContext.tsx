import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType, RegisterData } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Commencer en loading pour vérifier le localStorage
  const [initialized, setInitialized] = useState(false);

  // Vérifier si un utilisateur est déjà connecté au chargement
  useEffect(() => {
    const savedUser = localStorage.getItem('djassa_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        localStorage.removeItem('djassa_user');
      }
    }
    setLoading(false);
    setInitialized(true);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      // Simulation de connexion - en production, password serait utilisé pour l'authentification
      if (!email || !password) {
        throw new Error('Email et mot de passe requis');
      }
      
      // Vérification basique des credentials (en développement)
      if (password.length < 3) {
        throw new Error('Mot de passe trop court');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Utilisateur admin par défaut
      if (email === 'admin@djassa.ci' && password === 'admin123') {
        const adminUser: User = {
          id: 'admin-1',
          email: 'admin@djassa.ci',
          name: 'Administrateur Djassa',
          role: 'admin',
          location: {
            city: 'Abidjan',
            country: 'Côte d\'Ivoire',
            coordinates: { lat: 5.3600, lng: -4.0083 }
          }
        };
        
        setUser(adminUser);
        localStorage.setItem('djassa_user', JSON.stringify(adminUser));
        setLoading(false);
        return;
      }
      
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: 'buyer',
        location: {
          city: 'Abidjan',
          country: 'Côte d\'Ivoire'
        }
      };
      
      // Sauvegarder dans localStorage
      localStorage.setItem('djassa_user', JSON.stringify(mockUser));
      setUser(mockUser);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    setLoading(true);
    try {
      // Simulation d'inscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        role: userData.role,
        location: {
          city: 'Abidjan',
          country: 'Côte d\'Ivoire'
        }
      };
      
      // Sauvegarder dans localStorage
      localStorage.setItem('djassa_user', JSON.stringify(newUser));
      setUser(newUser);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('djassa_user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading: loading || !initialized
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};