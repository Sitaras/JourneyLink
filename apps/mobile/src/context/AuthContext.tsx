import React, {createContext, useContext, useState, useEffect} from 'react';
import {getItem, setItem, removeItem} from '../store/storage';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {authService} from '../services/auth';
import {IUserLogin, IUserRegistration} from '@journey-link/shared';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (data: IUserLogin) => Promise<void>;
  register: (data: IUserRegistration) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Initial check
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = () => {
      const token = getItem('accessToken');
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const loginMutation = useMutation({
    mutationFn: (data: IUserLogin) => authService.login(data),
    onSuccess: data => {
      const {accessToken, refreshToken} = data.tokens;
      setItem('accessToken', accessToken);
      setItem('refreshToken', refreshToken);
      setIsAuthenticated(true);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: IUserRegistration) => authService.register(data),
    onSuccess: data => {
      // Optional: Auto login after register or just navigate to login
      // For now, let's assume we want to auto-login if the API returns tokens,
      // but typically register just creates user.
      // If your API returns tokens on register, do this:
      if (data.data?.tokens) {
        const {accessToken, refreshToken} = data.data.tokens;
        setItem('accessToken', accessToken);
        setItem('refreshToken', refreshToken);
        setIsAuthenticated(true);
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const refreshToken = getItem<string>('refreshToken');
      if (refreshToken) {
        try {
          await authService.logout(refreshToken);
        } catch (e) {
          console.error('Logout failed', e);
        }
      }
    },
    onSettled: () => {
      removeItem('accessToken');
      removeItem('refreshToken');
      queryClient.clear();
      setIsAuthenticated(false);
    },
  });

  const value = {
    isAuthenticated,
    isLoading:
      isLoading ||
      loginMutation.isPending ||
      registerMutation.isPending ||
      logoutMutation.isPending,
    login: async (data: IUserLogin) => {
      await loginMutation.mutateAsync(data);
    },
    register: async (data: IUserRegistration) => {
      await registerMutation.mutateAsync(data);
    },
    logout: async () => {
      await logoutMutation.mutateAsync();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
