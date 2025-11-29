import { api, getAuthApi } from './api';
import { IUserLogin, IUserRegistration } from '@journey-link/shared';

export const authService = {
  login: async (data: IUserLogin) => {
    return api.url('/auth/login').post(data).json((json) => json?.data);
  },

  register: async (data: IUserRegistration) => {
    return api.url('/auth/register').post(data).json((json) => json?.data);
  },

  logout: async (refreshToken: string) => {
    return (await getAuthApi()).url('/auth/logout').post({ refreshToken }).res();
  },

  me: async () => {
    // Placeholder for future implementation
    return null;
  },
};
