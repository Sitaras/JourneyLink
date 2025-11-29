import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function replace(name: string, params?: any) {
  if (navigationRef.isReady()) {
    // React Navigation doesn't have a simple 'replace' on root unless we use Stack actions
    // But for Auth logout, we usually reset the state.
    // Since we use conditional rendering in AppNavigator based on isAuthenticated,
    // just updating the auth state (which useAuth/storage does) should trigger re-render.
    // So we might not need explicit replace for logout if we use context/state.

    // However, if we need to navigate:
    navigationRef.navigate(name as any, params);
  }
}
