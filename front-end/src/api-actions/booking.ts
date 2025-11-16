"use server";

import { IBookSeatPayload } from "@/schemas/bookingSchema";
import { postFetcher } from "./api";
import { IBookSeatResponse } from "@/types/booking.types";

export const bookSeat = async (body: IBookSeatPayload) => {
  try {
    const response = await postFetcher<IBookSeatPayload, IBookSeatResponse>(
      "booking",
      body
    );

    return response;
  } catch (error: any) {
    throw error?.message;
  }
};
