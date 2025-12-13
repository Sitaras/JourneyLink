"use server";

import { ICreateBookingPayload, IBookSeatResponse } from "@journey-link/shared";
import { postFetcher } from "./api";

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
