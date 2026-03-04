import wretch, { WretchError, WretchResponse } from "wretch";
import { authStorage } from "../lib/authStorage";
import { getQueryClient } from "@/lib/queryClient";

export const api = wretch(process.env.NEXT_PUBLIC_BASE_URL)
  .customError(async (error, response) => {
    return { ...error, json: await response.json() };
  })
  .catcherFallback((err: any) => {
    throw err.json;
  });

const state = {
  isRefreshingToken: false,
  queuedRequests: [] as Array<{
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
    req: any;
  }>,
};

export const refreshTokenService = async (refreshToken: string) => {
  return wretch(process.env.NEXT_PUBLIC_BASE_URL)
    .url("auth/refresh-token")
    .post({ refreshToken })
    .json((json) => json?.data);
};

export const getAuthApi = async () => {
  const accessToken = await authStorage.getAccessToken();

  return wretch(process.env.NEXT_PUBLIC_BASE_URL)
    .auth(`Bearer ${accessToken}`)
    .customError(async (error, response) => {
      return { ...error, json: await response.json() };
    })
    .resolve((resolver) =>
      resolver
        .unauthorized(async (error, originalReq) => {
          if ((originalReq as any)._isRetry) {
            throw error.json;
          }

          (originalReq as any)._isRetry = true;

          if (state.isRefreshingToken) {
            return new Promise((resolve, reject) => {
              state.queuedRequests.push({ resolve, reject, req: originalReq });
            });
          }

          state.isRefreshingToken = true;
          await authStorage.removeAccessToken();

          const refreshToken = await authStorage.getRefreshToken();
          if (!refreshToken) {
            state.isRefreshingToken = false;
            if (typeof window !== "undefined") {
              window.location.href = "/login";
              return;
            }
            throw error.json;
          }

          try {
            const res = await refreshTokenService(refreshToken);
            const { accessToken: newToken, refreshToken: newRefreshToken } =
              res || {};

            if (!newRefreshToken || !newToken) {
              if (typeof window !== "undefined") {
                await authStorage.clearAuthTokens();
                window.location.href = "/login";
                return;
              }
              throw error.json;
            }

            await authStorage.setRefreshToken({
              refreshToken: newRefreshToken,
            });
            await authStorage.setToken({ token: newToken });

            const response = await originalReq
              .auth(`Bearer ${newToken}`)
              .customError(async (error, response) => {
                return { ...error, json: await response.json() };
              })
              .fetch()
              .unauthorized((err) => {
                throw err;
              })
              .json((json) => json?.data);

            await Promise.all(
              state.queuedRequests.map(async ({ resolve, reject, req }) => {
                try {
                  const result = await req
                    .auth(`Bearer ${newToken}`)
                    .customError(
                      async (error: WretchError, response: WretchResponse) => {
                        return { ...error, json: await response.json() };
                      }
                    )
                    .fetch()
                    .json((json: { data: any }) => json?.data);
                  resolve(result);
                } catch (err) {
                  reject(err);
                }
              })
            );

            return response;
          } catch (error) {
            state.queuedRequests.forEach(({ reject }) => reject(error));
            if ((error as WretchError)?.status === 401) {
              if (typeof window !== "undefined") {
                await authStorage.clearAuthTokens();
                window.location.href = "/login";
                return;
              }
              const errorJson = await (error as WretchError).response.json();
              throw errorJson;
            }
            throw error;
          } finally {
            state.queuedRequests = [];
            state.isRefreshingToken = false;
            const queryClient = getQueryClient();
            queryClient.invalidateQueries();
          }
        })
        .fetchError((err) => {
          throw err;
        })
    )
    .catcherFallback((err: any) => {
      throw err.json;
    });
};

export const fetcher = async <IResponse>(url: string) => {
  return (await getAuthApi()).get(url).json<IResponse>((json) => json?.data);
};

export const postFetcher = async <IBody, IResponse>(url: string, body: IBody) =>
  (await getAuthApi())
    .url(url)
    .post(body)
    .json<IResponse>((json) => json?.data);

export const patchFetcher = async <IBody, IResponse>(
  url: string,
  body: IBody
) =>
  (await getAuthApi())
    .url(url)
    .patch(body)
    .json<IResponse>((json) => json?.data);

export const putFetcher = async <IBody, IResponse>(url: string, body: IBody) =>
  (await getAuthApi())
    .url(url)
    .put(body)
    .json<IResponse>((json) => json?.data);
