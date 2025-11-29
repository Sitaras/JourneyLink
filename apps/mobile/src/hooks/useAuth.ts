import { useAuthContext } from '../context/AuthContext';

// We need a way to navigate from outside components or pass navigation
// For simplicity, we'll assume this hook is used in components that can navigate
// Or we can use a navigation ref service (advanced)
// For now, let's just return the mutations and let the component handle navigation on success
// OR we can use useNavigation here if it's called inside a component under NavigationContainer



export const useAuth = () => {
  const { isAuthenticated, login, register, logout, isLoading } = useAuthContext();

  return {
    isAuthenticated,
    login: { mutate: login, isPending: isLoading }, // Adapter to match previous API roughly or just expose context directly
    register: { mutate: register, isPending: isLoading },
    logout: { mutate: logout, isPending: isLoading },
    isLoading,
  };
};
