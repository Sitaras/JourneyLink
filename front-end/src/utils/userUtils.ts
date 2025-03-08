import { jwtDecode } from "jwt-decode";
import { ITokenPayload } from "@/types/user.types";

export const decodeToken = (token: string) => {
  try {
    const { userId, roles } = jwtDecode<ITokenPayload>(token);

    return {
      userId,
      roles,
    };
  } catch {
    return {};
  }
};
