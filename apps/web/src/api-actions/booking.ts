"use server";

import {
  ICreateBookingPayload,
  IBookSeatResponse,
  IBooking,
} from "@journey-link/shared";
import { postFetcher, fetcher } from "./api";

export const bookSeat = async (body: ICreateBookingPayload) => {
  try {
    const response = await postFetcher<
      ICreateBookingPayload,
      IBookSeatResponse
    >("booking", body);

    return response;
  } catch (error: any) {
    throw error?.message;
  }
};

export const getRideBookings = async (rideId: string) => {
  try {
    const response = await fetcher<IBooking[]>(`booking/ride/${rideId}`);
    return response;
  } catch (error: any) {
    throw error?.message;
  }
};

export const acceptBooking = async (bookingId: string) => {
  try {
    const response = await postFetcher<Record<string, never>, IBooking>(
      `booking/${bookingId}/accept`,
      {}
    );
    return response;
  } catch (error: any) {
    throw error?.message;
  }
};

export const declineBooking = async (bookingId: string) => {
  try {
    const response = await postFetcher<Record<string, never>, IBooking>(
      `booking/${bookingId}/decline`,
      {}
    );
    return response;
  } catch (error: any) {
    throw error?.message;
  }
};

export const cancelBooking = async (bookingId: string) => {
  try {
    const response = await postFetcher<
      Record<string, never>,
      { status: string }
    >(`booking/${bookingId}/cancel`, {});
    return response;
  } catch (error: any) {
    throw error?.message || "Failed to cancel booking";
  }
};
