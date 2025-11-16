"use server";

import { ProfileResponse } from "@/types/profile.types";
import { fetcher, patchFetcher } from "./api";
import { UpdateProfilePayload } from "@/schemas/user/profileSchema";
import { formatToUTC } from "@/utils/dateUtils";
import {
  getUserRidesQuerySchema,
  IGetUserRidesQueryPayload,
} from "@/schemas/user/userRideSchema";
import { generateQueryString } from "@/utils/genericUtils";
import { UserRidesResponse } from "@/types/rides.types";

export const getUserInfo = async () => {
  try {
    const response = await fetcher("me/user-info");

    return response;
  } catch (error: any) {
    throw error?.message;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await fetcher<ProfileResponse>("me/profile");

    return response;
  } catch (error: any) {
    throw error?.message;
  }
};

export const updateUserProfile = async (body: UpdateProfilePayload) => {
  const dateOfBirthDateISOstring = formatToUTC(body.dateOfBirth);

  try {
    const response = await patchFetcher<UpdateProfilePayload, ProfileResponse>(
      "/me/profile",
      {
        ...body,
        dateOfBirth: dateOfBirthDateISOstring,
      }
    );

    return response;
  } catch (error: any) {
    throw error?.message;
  }
};

export const getUserRides = async (parameters: IGetUserRidesQueryPayload) => {
  const parsedParams = getUserRidesQuerySchema.parse(parameters);

  const queryString = generateQueryString(parsedParams);

  try {
    const response = await fetcher<UserRidesResponse>(
      `me/user-rides?${queryString}`
    );

    // // Simulate network delay
    // await new Promise((resolve) => setTimeout(resolve, 800));

    return response;
  } catch (error: any) {
    throw error?.message;
  }
};
