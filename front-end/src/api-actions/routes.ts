"use server";
import { api } from "./api";
import {
  getRoutesQuerySchema,
  IGetRoutesQueryPayload,
} from "@/schemas/routesSchema";
import { RouteSearchResponse } from "@/types/routes";

export const getRoutes = async (parameters: IGetRoutesQueryPayload) => {
  const parsedParams = getRoutesQuerySchema.parse(parameters);

  const queryString = new URLSearchParams(
    Object.entries(parsedParams)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)])
  ).toString();

  try {
    const response = await api
      .url(`routes?${queryString}`)
      .get()
      .json<RouteSearchResponse>((json) => json?.data);

    return response;
  } catch (error: any) {
    throw error?.message;
  }
};
