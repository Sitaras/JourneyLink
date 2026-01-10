import Cookies from "js-cookie";

export const authStorage = {
  setToken: async ({ token }: { token: string }) => {
    if (typeof window === "undefined") {
      try {
        const { cookies } = await import("next/headers");
        (await cookies()).set({
          name: "access_token",
          value: token,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 15,
        });
      } catch (error) {
        // Silent failure on server components - standard behavior
      }
    } else {
      Cookies.set("access_token", token, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }
  },
  setRefreshToken: async ({ refreshToken }: { refreshToken: string }) => {
    if (typeof window === "undefined") {
      try {
        const { cookies } = await import("next/headers");
        (await cookies()).set({
          name: "refresh_token",
          value: refreshToken,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
        });
      } catch (error) {
        // Silent failure on server components
      }
    } else {
      Cookies.set("refresh_token", refreshToken, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }
  },
  getAccessToken: async () => {
    if (typeof window === "undefined") {
      try {
        const { cookies } = await import("next/headers");
        return (await cookies()).get("access_token")?.value;
      } catch {
        return undefined;
      }
    }
    return Cookies.get("access_token");
  },
  getRefreshToken: async () => {
    if (typeof window === "undefined") {
      try {
        const { cookies } = await import("next/headers");
        return (await cookies()).get("refresh_token")?.value;
      } catch {
        return undefined;
      }
    }
    return Cookies.get("refresh_token");
  },
  removeAccessToken: async () => {
    if (typeof window === "undefined") {
      try {
        const { cookies } = await import("next/headers");
        (await cookies()).delete("access_token");
      } catch (error) {
        // Silent failure on server components
      }
    } else {
      Cookies.remove("access_token");
    }
  },
  removeRefreshToken: async () => {
    if (typeof window === "undefined") {
      try {
        const { cookies } = await import("next/headers");
        (await cookies()).delete("refresh_token");
      } catch (error) {
        // Silent failure on server components
      }
    } else {
      Cookies.remove("refresh_token");
    }
  },
  clearAuthTokens: async () => {
    if (typeof window === "undefined") {
      try {
        const { cookies } = await import("next/headers");
        (await cookies()).delete("access_token");
        (await cookies()).delete("refresh_token");
      } catch (error) {
        // Silent failure on server components
      }
    } else {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
    }
  },
};
