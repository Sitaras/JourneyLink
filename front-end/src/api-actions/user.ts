"use server";

import { ProfileResponse } from "@/types/profile.types";
import { fetcher, patchFetcher } from "./api";
import { UpdateProfilePayload } from "@/schemas/profileSchema";
import { formatToUTC } from "@/utils/dateUtils";

export const getUserInfo = async () => {
  try {
    const response = fetcher("/me/user-info");

    return response;
  } catch (error: any) {
    throw error?.message;
  }
};

export const getUserProfile = async () => {
  try {
    const response = fetcher<ProfileResponse>("/me/profile");

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
