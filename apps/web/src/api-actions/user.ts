"use server";

import { ProfileResponse } from "@journey-link/shared";
import { fetcher, patchFetcher } from "./api";
import { UpdateProfilePayload } from "@journey-link/shared";
import { formatToUTC } from "@journey-link/shared";
import {
  getUserRidesQuerySchema,
  IGetUserRidesQueryPayload,
} from "@/schemas/user/userRideSchema";
import { generateQueryString } from "@/utils/genericUtils";
import { UserRidesResponse, IUser } from "@journey-link/shared";
import { extractErrorMessage } from "@/utils/errorUtils";

export const getUserInfo = async () => {
  const response = await fetcher<IUser>("me/user-info");
  return response;
};

export const getUserProfile = async () => {
  const response = await fetcher<ProfileResponse>("me/profile");
  return response;
};

export const getUserProfileById = async (userId: string) => {
  const response = await fetcher<ProfileResponse>(`me/${userId}/profile`);
  return response;
};

export const updateUserProfile = async (body: UpdateProfilePayload) => {
  try {
    const dateOfBirthDateISOstring = body.dateOfBirth
      ? formatToUTC(body.dateOfBirth)
      : undefined;

    const response = await patchFetcher<UpdateProfilePayload, ProfileResponse>(
      "/me/profile",
      {
        ...body,
        dateOfBirth: dateOfBirthDateISOstring,
      }
    );

    return response;
  } catch (error: any) {
    throw extractErrorMessage(error);
  }
};

export const getUserRides = async (parameters: IGetUserRidesQueryPayload) => {
  const parsedParams = getUserRidesQuerySchema.parse(parameters);
  const queryString = generateQueryString(parsedParams);

  const response = await fetcher<UserRidesResponse>(
    `me/user-rides?${queryString}`
  );

  return response;
};
