"use server";

import { api } from "./api";
import { cookies } from "next/headers";

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
      // httpOnly: true,
      secure: process.env.NODE_ENV !== "production",
      sameSite: "strict",
    });
    (await cookies()).set({
      name: "refresh_token",
      value: response?.tokens?.refreshToken,
      // httpOnly: true,
      secure: process.env.NODE_ENV !== "production",
      sameSite: "strict",
    });
        
    return response;
  } catch {
    return { message: "Failed to sign in" };
  }
};

export const register = async (email: string, password: string) => {
  try {
    const response = await fetch("https://your-backend.com/api/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Failed to sign up");
    }

    return response.json();
  } catch (error) {
    console.error("Sign-up error:", error);
    throw error;
  }
};

export const settings = async (email: string, password: string) => {
  try {
    const response = await fetch("https://your-backend.com/api/profile", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Failed to sign up");
    }

    return response.json();
  } catch (error) {
    console.error("Sign-up error:", error);
    throw error;
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
