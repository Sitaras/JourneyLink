"use server";
import { api, refreshTokenService, getAuthApi } from "./api";
import { formatToUTC } from "@/utils/dateUtils";
import { authStorage } from "../lib/authStorage";
import { LoginInput, RegisterInput } from "@journey-link/shared";
import { revalidatePath } from "next/cache";
import { extractErrorMessage } from "@/utils/errorUtils";

type LoginFormValues = LoginInput;

export const login = async (body: LoginFormValues) => {
  try {
    const response = await api
      .url("auth/login")
      .post(body)
      .json((json) => json?.data);

    await authStorage.setToken({
      token: response?.tokens?.accessToken,
    });
    await authStorage.setRefreshToken({
      refreshToken: response?.tokens?.refreshToken,
    });

    revalidatePath("/", "layout");
    return response;
  } catch (error: any) {
    throw extractErrorMessage(error);
  }
};

type RegisterFormValues = RegisterInput;

export const register = async (body: RegisterFormValues) => {
  try {
    const dateOfBirthDateISOstring = formatToUTC(body.dateOfBirth);
    const response = await api
      .url("auth/register")
      .post({
        ...body,
        dateOfBirth: dateOfBirthDateISOstring,
      })
      .json((json) => json?.data);
    return response;
  } catch (error: any) {
    throw extractErrorMessage(error);
  }
};

export const logout = async () => {
  try {
    const refreshToken = await authStorage.getRefreshToken();
    await (await getAuthApi()).url("auth/logout").post({ refreshToken }).res();
  } catch (error: any) {
    throw extractErrorMessage(error);
  } finally {
    await authStorage.clearAuthTokens();
    revalidatePath("/", "layout");
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
