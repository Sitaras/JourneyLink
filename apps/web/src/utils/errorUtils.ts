import { ErrorCodes } from "@journey-link/shared";
import { getErrorMapping } from "./errorMappings";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extractErrorMessage = (error: any): string => {
  return error.message || ErrorCodes.SOMETHING_WENT_WRONG;
};

export const parseActionError = (error: string): string => {
  const errorMessage = extractErrorMessage(error);
  const mapping = getErrorMapping();

  return mapping?.[errorMessage] || errorMessage;
};
