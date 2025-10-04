"use server";

import { fetcher } from "./api";

export const getUserInfo = async () => {
  try {
    const response = fetcher("/me/user-info");

    return response;
  } catch (error: any) {
    throw error?.message;
  }
};
