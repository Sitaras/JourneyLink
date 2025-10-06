import { cookies } from "next/headers";

export const authStorage = {
  setToken: async ({ token }: { token: string }) => {
    (await cookies()).set({
      name: "access_token",
      value: token,
      secure: process.env.NODE_ENV !== "production",
      sameSite: "strict",
    });
  },
  setRefreshToken: async ({ refreshToken }: { refreshToken: string }) => {
    (await cookies()).set({
      name: "refresh_token",
      value: refreshToken,
      secure: process.env.NODE_ENV !== "production",
      sameSite: "strict",
    });
  },
  getRefreshToken: async () => {
    return (await cookies()).get("refresh_token")?.value;
  },
  getAccessToken: async () => {
    return (await cookies()).get("access_token")?.value;
  },
  removeToken: async () => {
    (await cookies()).delete("access_token");
  },
  removeRefreshToken: async () => {
    (await cookies()).delete("refresh_token");
  },
  clearAuthTokens: async () => {
    (await cookies()).delete("access_token");
    (await cookies()).delete("refresh_token");
  },
};