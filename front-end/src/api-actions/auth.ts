"use server";

import { api } from "./api";
import { cookies } from "next/headers";
import { formatToUTC } from "@/utils/dateUtils";

export const login = async (prevState: unknown, form: FormData) => {
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  try {
    const response = await api
      .url("auth/login")
      .post({ email, password })
      .json((json) => json?.data);

    (await cookies()).set({
      name: "access_token",
      value: response?.tokens?.accessToken,
      secure: process.env.NODE_ENV !== "production",
      sameSite: "strict",
    });
    (await cookies()).set({
      name: "refresh_token",
      value: response?.tokens?.refreshToken,
      secure: process.env.NODE_ENV !== "production",
      sameSite: "strict",
    });

    return { success: true, ...response };
  } catch (error) {
    return { success: false, message: "loginFailed", error };
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

    return { success: true, ...response };
  } catch (error) {
    return { success: false, message: "registeredFailed", error };
  }
};

export const getUserInfo = async () => {
  try {
    const response = await fetch("https://your-backend.com/api/user", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to get user info");
    }

    return response.json();
  } catch (error) {
    console.error("User info error:", error);
    throw error;
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
