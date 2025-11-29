import { fetcher, postFetcher } from './api';
import { Ride, RideSearchResponse, RideCreationResponse } from '@journey-link/shared';

export const rideService = {
  searchRides: async (params: any) => {
    const query = new URLSearchParams(params).toString();
    return fetcher<RideSearchResponse>(`/ride?${query}`);
  },

  getRideById: async (id: string) => {
    return fetcher<Ride>(`/ride/${id}`);
  },

  createRide: async (data: any) => {
    return postFetcher<any, RideCreationResponse>('/ride', data);
  },

  getMyRides: async () => {
    return fetcher<Ride[]>('/ride/my-rides');
  },
};
