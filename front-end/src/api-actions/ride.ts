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

export const getRides = async (parameters: IGetRidesQueryPayload) => {
  const parsedParams = getRidesQuerySchema.parse(parameters);

  const queryString = new URLSearchParams(
    Object.entries(parsedParams)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)])
  ).toString();

  try {
    const response = await api
      .url(`rides?${queryString}`)
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
    >("rides", body);

    return response;
  } catch (error: any) {
    throw error?.message;
  }
};

export const getRide = async (id: string) => {
  try {
    const response = await fetcher<Ride>(`rides/${id}`);

    return response;
  } catch (error: any) {
    throw error?.message;
  }
};
