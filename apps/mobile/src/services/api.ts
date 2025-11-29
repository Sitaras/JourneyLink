import wretch, { WretchError, WretchResponse } from 'wretch';
import { getItem, setItem, removeItem } from '../store/storage';
import * as NavigationService from '../navigation/NavigationService';



// Use local IP for Android emulator, localhost for iOS simulator
const BASE_URL = 'http://localhost:8000/api';

export const api = wretch(BASE_URL)
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
  return wretch(BASE_URL)
    .url('/auth/refresh-token')
    .post({ refreshToken })
    .json((json) => json?.data);
};

export const getAuthApi = async () => {
  const accessToken = getItem<string>('accessToken');

  return wretch(BASE_URL)
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

          const refreshToken = getItem<string>('refreshToken');
          if (!refreshToken) {
            handleLogout();
            throw error.json;
          }

          try {
            state.isRefreshingToken = true;
            const refreshResponse = await refreshTokenService(refreshToken);
            const { accessToken: newToken, refreshToken: newRefreshToken } =
              refreshResponse || {};

            if (!newRefreshToken) {
              state.isRefreshingToken = false;
              handleLogout();
              throw error.json;
            }

            setItem('refreshToken', newRefreshToken);
            if (newToken) {
              setItem('accessToken', newToken);
            }

            const response = await originalReq
              .auth(`Bearer ${newToken}`)
              .customError(async (err, res) => {
                return { ...err, json: await res.json() };
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
                    async (err: WretchError, res: WretchResponse) => {
                      return { ...err, json: await res.json() };
                    }
                  )
                  .fetch()
                  .json((json: { data: any }) => json?.data);
              } catch (err) {
                throw err;
              }
            });

            return response;
          } catch (innerError) {
            if ((innerError as WretchError)?.status === 401) {
              handleLogout();
              const errorJson = await (innerError as WretchError).response.json();
              throw errorJson;
            }
            throw innerError;
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

const handleLogout = () => {
  removeItem('accessToken');
  removeItem('refreshToken');
  NavigationService.navigate('Auth', { screen: 'Login' });
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
