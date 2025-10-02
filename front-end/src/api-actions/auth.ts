"use server";

import { api, fetcher, refreshTokenService } from "./api";
import { formatToUTC } from "@/utils/dateUtils";
import { authStorage } from "./authStorage";

export const login = async (prevState: unknown, form: FormData) => {
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  try {
    const response = await api
      .url("auth/login")
      .post({ email, password })
      .json((json) => json?.data);

    await authStorage.setToken({
      token: response?.tokens?.accessToken,
    });
    await authStorage.setRefreshToken({
      refreshToken: response?.tokens?.refreshToken,
    });

    return { success: true, ...response };
  } catch (error: any) {
    throw error?.message;
  }
};

export const register = async (prevState: unknown, form: FormData) => {
  const email = form.get("email") as string;
  const firstName = form.get("firstName") as string;
  const lastName = form.get("lastName") as string;
  const phoneNumber = form.get("phoneNumber") as string;
  const dateOfBirth = form.get("dateOfBirth") as string;
  const password = form.get("password") as string;
  const verifyPassword = form.get("verifyPassword") as string;

  const dateOfBirthDateISOstring = formatToUTC(dateOfBirth);

  try {
    const response = await api
      .url("auth/register")
      .post({
        email,
        firstName,
        lastName,
        phoneNumber,
        dateOfBirth: dateOfBirthDateISOstring,
        password,
        verifyPassword,
      })
      .json((json) => json?.data);

    return response;
  } catch (error: any) {
    throw error?.message;
  }
};

export const getUserInfo = async () => {
  try {
    const response = fetcher("auth/userInfo");

    return response;
  } catch (error: any) {
    throw error?.message;
  }
};

export const logout = async () => {
  try {
    const response = await fetch("https://your-backend.com/api/signout", {
      method: "POST",
      credentials: "include", // Ensure cookies or tokens are included
    });

    if (!response.ok) {
      throw new Error("Failed to sign out");
    }
  } catch (error) {
    console.error("Sign-out error:", error);
    throw error;
  }
};

export const refreshTokens = async () => {
  const refreshToken = await authStorage.getRefreshToken();
  if (!refreshToken) throw new Error("no_refresh_token");

  const res = await refreshTokenService(refreshToken);
  const { accessToken: newToken, refreshToken: newRefreshToken } = res || {};

  if (!newRefreshToken || !newToken) {
    await authStorage.clearAuthTokens();
    throw new Error("refresh_failed");
  }

  await authStorage.setToken({
    token: newToken,
  });

  await authStorage.setRefreshToken({
    refreshToken: newRefreshToken,
  });


  return newToken;
};
