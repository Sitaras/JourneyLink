"use server";

import { patchFetcher, getAuthApi } from "./api";
import { INotification } from "@journey-link/shared";

export interface IGetNotificationsResponse {
  data: INotification[];
  meta: {
    total: number;
    page: number;
    pages: number;
  };
}

export const getNotificationsFn = async ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
} = {}) => {
  return (await getAuthApi())
    .url(`notification?page=${page}&limit=${limit}`)
    .get()
    .json<IGetNotificationsResponse>();
};

export const markNotificationAsReadFn = async (id: string) => {
  return await patchFetcher(`notification/${id}/read`, {});
};

export const markAllNotificationsAsReadFn = async () => {
  return await patchFetcher("notification/read-all", {});
};
