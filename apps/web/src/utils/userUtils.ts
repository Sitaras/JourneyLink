import { jwtDecode } from "jwt-decode";
import { ITokenPayload } from "@journey-link/shared";

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
