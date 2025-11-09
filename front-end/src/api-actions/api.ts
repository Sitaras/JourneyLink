import wretch from "wretch";
import { authStorage } from "./authStorage";

export const api = wretch(process.env.NEXT_PUBLIC_BASE_URL)
  .errorType("json")
  .catcherFallback((err) => {
    throw err.json;
  });

const state = {
  isRefreshingToken: false,
  queuedRequests: new Map<string, { req: any }>(),
  resolveRefreshPromise: null as ((token: string) => void) | null,
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
    .errorType("json")
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
              .fetch()
              .json((json) => json?.data);

            if (state.resolveRefreshPromise) {
              state.resolveRefreshPromise(newToken);
            }

            state.queuedRequests.forEach(async ({ req }) => {
              try {
                const result = await req
                  .auth(`Bearer ${newToken}`)
                  .fetch()
                  .json((json: { data: any }) => json?.data);
                return result;
              } catch (err) {
                throw err;
              }
            });

            state.queuedRequests.clear();
            state.isRefreshingToken = false;

            return response;
          } catch (refreshError) {
            state.isRefreshingToken = false;
            await authStorage.clearAuthTokens();
            // if (typeof window !== "undefined") {
            //   window.location.href = "/login";
            // }
            throw error.json;
          } finally {
            state.resolveRefreshPromise = null;
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
