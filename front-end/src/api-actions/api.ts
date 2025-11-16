import wretch, { WretchError, WretchResponse } from "wretch";
import { authStorage } from "./authStorage";

export const api = wretch(process.env.NEXT_PUBLIC_BASE_URL)
  .customError(async (error, response) => {
    return { ...error, json: await response.json() };
  })
  .catcherFallback((err) => {
    throw err.json;
  });

const state = {
  isRefreshingToken: false,
  queuedRequests: new Map<string, { req: any }>(),
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
            state.queuedRequests.set(originalReq?._url, {
              req: originalReq,
            });
            return Promise.reject(error);
          }

          await authStorage.removeToken();

          const refreshToken = await authStorage.getRefreshToken();
          if (!refreshToken) {
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
            throw error.json;
          }

          try {
            state.isRefreshingToken = true;
            const res = await refreshTokenService(refreshToken);
            const { accessToken: newToken, refreshToken: newRefreshToken } =
              res || {};

            if (!newRefreshToken) {
              state.isRefreshingToken = false;
              await authStorage.clearAuthTokens();
              if (typeof window !== "undefined") {
                window.location.href = "/login";
              }
              throw error.json;
            }

            await authStorage.setRefreshToken({
              refreshToken: newRefreshToken,
            });
            if (newToken) {
              await authStorage.setToken({ token: newToken });
            }

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

            state.queuedRequests.forEach(async ({ req }) => {
              try {
                return await req
                  .auth(`Bearer ${newToken}`)
                  .customError(
                    async (error: WretchError, response: WretchResponse) => {
                      return { ...error, json: await response.json() };
                    }
                  )
                  .fetch()
                  .json((json: { data: any }) => json?.data);
              } catch (err) {
                throw err;
              }
            });

            return response;
          } catch (error) {
            if ((error as WretchError)?.status === 401) {
              await authStorage.clearAuthTokens();
              const errorJson = await (error as WretchError).response.json();
              throw errorJson;
            }
            throw error;
          } finally {
            state.queuedRequests.clear();
            state.isRefreshingToken = false;
          }
        })
        .fetchError((err) => {
          throw err;
        })
    )
    .catcherFallback((err) => {
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
