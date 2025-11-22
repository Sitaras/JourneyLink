"use server";
import { api, refreshTokenService } from "./api";
import { formatToUTC } from "@/utils/dateUtils";
import { authStorage } from "../lib/authStorage";
import { registerSchema } from "@/schemas/auth/registerSchema";
import z from "zod";
import { loginSchema } from "@/schemas/auth/loginSchema";
import { revalidatePath } from "next/cache";

type LoginFormValues = z.infer<typeof loginSchema>;

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
    throw new Error(error?.message || "Login failed");
  }
};

type RegisterFormValues = z.infer<typeof registerSchema>;

export const register = async (body: RegisterFormValues) => {
  const dateOfBirthDateISOstring = formatToUTC(body.dateOfBirth);
  try {
    const response = await api
      .url("auth/register")
      .post({
        ...body,
        dateOfBirth: dateOfBirthDateISOstring,
      })
      .json((json) => json?.data);
    return response;
  } catch (error: any) {
    throw new Error(error?.message || "Registration failed");
  }
};

export const logout = async () => {
  try {

    const refreshToken = await authStorage.getRefreshToken();
    
    if (refreshToken) {

      await api
        .url("auth/logout")
        .post({ refreshToken })
        .res();
    }
    
    await authStorage.clearAuthTokens();
    revalidatePath("/", "layout");
    
    return { success: true };
  } catch (error: any) {
    console.error("Logout error:", error);
    
    await authStorage.clearAuthTokens();
    revalidatePath("/", "layout");
    
    throw new Error(error?.message || "Logout failed");
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
