"use server";
import { api, postFetcher } from "./api";
import {
  getRoutesQuerySchema,
  ICreateRoutePayload,
  IGetRoutesQueryPayload,
} from "@/schemas/routesSchema";
import { RouteCreationResponse, RouteSearchResponse } from "@/types/routes";

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

export const createRoute = async (body: ICreateRoutePayload) => {
  try {
    const response = await postFetcher<
      ICreateRoutePayload,
      RouteCreationResponse
    >("routes", body);

    return response;
  } catch (error: any) {
    throw error?.message;
  }
};
