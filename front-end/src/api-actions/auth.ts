"use server";

import api from "./api";

export const refreshTokenService = (refreshToken: string) => {
  return api.post("/auth/api/refreshToken", { refreshToken });
};

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch("https://your-backend.com/api/signin", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Failed to sign in");
    }

    return response.json();
  } catch (error) {
    console.error("Sign-in error:", error);
    throw error;
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
