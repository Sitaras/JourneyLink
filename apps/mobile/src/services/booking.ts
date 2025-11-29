import { postFetcher } from './api';
import { IBookSeatPayload, IBookSeatResponse } from '@journey-link/shared';

export const bookingService = {
  bookSeat: async (body: IBookSeatPayload) => {
    return postFetcher<IBookSeatPayload, IBookSeatResponse>('/booking', body);
  },
};
