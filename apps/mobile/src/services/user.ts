import { fetcher, patchFetcher } from './api';
import { ProfileResponse, UserRidesResponse, UpdateProfilePayload } from '@journey-link/shared';

export const userService = {
  getUserInfo: async () => {
    return fetcher('/me/user-info');
  },

  getUserProfile: async () => {
    return fetcher<ProfileResponse>('/me/profile');
  },

  updateUserProfile: async (body: UpdateProfilePayload) => {
    // Format date if needed, similar to web
    // const dateOfBirthDateISOstring = formatToUTC(body.dateOfBirth);
    // For now passing body directly, assuming date is handled or already string
    return patchFetcher<UpdateProfilePayload, ProfileResponse>('/me/profile', body);
  },

  getUserRides: async (params: any) => {
    const query = new URLSearchParams(params).toString();
    return fetcher<UserRidesResponse>(`/me/user-rides?${query}`);
  },
};
