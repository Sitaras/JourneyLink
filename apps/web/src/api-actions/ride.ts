"use server";
import { api, fetcher, postFetcher, putFetcher } from "./api";
import {
  getRideQuerySchema,
  IGetRideQueryInput,
  ICreateRidePayload,
  Ride,
  RideCreationResponse,
  RideSearchResponse,
} from "@journey-link/shared";
import { generateQueryString } from "@/utils/genericUtils";
import { extractErrorMessage } from "@/utils/errorUtils";

export const getRides = async (parameters: IGetRideQueryInput) => {
  const parsedParams = getRideQuerySchema.parse(parameters);

  const queryString = generateQueryString(parsedParams);

  const response = await api
    .url(`ride/all?${queryString}`)
    .get()
    .json<RideSearchResponse>((json) => json?.data);

  return response;
};

export const createRide = async (body: ICreateRidePayload) => {
  const response = await postFetcher<ICreateRidePayload, RideCreationResponse>(
    "ride",
    body
  );

  return response;
};

export const getRide = async (id: string) => {
  const response = await fetcher<Ride>(`ride/${id}`);
  return response;
};

export const updateRide = async (rideId: string, data: ICreateRidePayload) => {
  try {
    const response = await putFetcher<ICreateRidePayload, Ride>(
      `ride/${rideId}`,
      data
    );

    return response;
  } catch (error: any) {
    throw extractErrorMessage(error);
  }
};
