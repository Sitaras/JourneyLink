"use server";
import { api, fetcher, postFetcher } from "./api";
import {
  getRidesQuerySchema,
  ICreateRidePayload,
  IGetRidesQueryPayload,
} from "@/schemas/rideSchema";
import {
  Ride,
  RideCreationResponse,
  RideSearchResponse,
} from "@/types/rides.types";
import { generateQueryString } from "@/utils/genericUtils";

export const getRides = async (parameters: IGetRidesQueryPayload) => {
  const parsedParams = getRidesQuerySchema.parse(parameters);

  const queryString = generateQueryString(parsedParams);

  try {
    const response = await api
      .url(`ride/all?${queryString}`)
      .get()
      .json<RideSearchResponse>((json) => json?.data);

    return response;
  } catch (error: any) {
    throw error?.message;
  }
};

export const createRide = async (body: ICreateRidePayload) => {
  try {
    const response = await postFetcher<
      ICreateRidePayload,
      RideCreationResponse
    >("ride", body);

    return response;
  } catch (error: any) {
    throw error?.message;
  }
};

export const getRide = async (id: string) => {
  try {
    const response = await fetcher<Ride>(`ride/${id}`);

    return response;
  } catch (error: any) {
    throw error?.message;
  }
};
