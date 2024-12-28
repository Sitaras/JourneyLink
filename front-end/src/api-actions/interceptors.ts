import authStorage from "@/storage/authStorage";
import { refreshTokenService } from "./auth";
import {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { IRefreshResponse } from "@/types/user.types";
import { mutate } from "swr";

export const requestInterceptor = (
  config: InternalAxiosRequestConfig<unknown>
) => {
  const token = authStorage.getToken();
  if (!token && config.headers["Authorization"]) {
    delete config.headers["Authorization"];
  } else {
    config.headers["Authorization"] = `Bearer ${authStorage.getToken()}`;
  }
  return config;
};

export const state = {
  isRefreshingToken: false,
  //will hold all requests that failed with 401, in order to repeat after token refresh
  queuedRequests: new Map(),
};

export const responseInterceptor = async (
  error: {
    config: InternalAxiosRequestConfig<unknown> & { _isRetry?: boolean };
    response: { status: number };
  },
  api: AxiosInstance
) => {
  const originalRequest = error.config;

  if (
    error?.response?.status !== 401 ||
    !originalRequest ||
    originalRequest._isRetry
  ) {
    throw error;
  }
  //flag to avoid infinite loop in case service fails again with 401
  originalRequest._isRetry = true;
  //clear invalid token so as to not be used in subsequent requests
  authStorage.removeToken();
  if (state.isRefreshingToken) {
    state.queuedRequests.set(originalRequest?.url, {
      request: originalRequest,
      api: api,
    });
    throw error;
  }

  const refreshToken = authStorage.getRefreshToken();
  if (!refreshToken) {
    window.location.href = "/login";
    throw error;
  }

  state.isRefreshingToken = true;
  return refreshTokenService(refreshToken)
    .then((res: AxiosResponse<IRefreshResponse>) => {
      const { accessToken: newToken, refreshToken: newRefreshToken } =
        res?.data || {};

      if (!newRefreshToken) {
        state.isRefreshingToken = false;
        authStorage.clearAuthTokens();
        window.location.href = "/login";
        return;
      }
      authStorage.setRefreshToken({ refreshToken: newRefreshToken });

      if (newToken) {
        authStorage.setToken({ token: newToken });
      }

      originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

      return api(originalRequest).then((response) => {

        // Run swr related apis with SWR and remove them from the queue
        const queuedRequestsUrls = [
          originalRequest?.url, // original request might re-run in swr mutation. we will keep this for now, so that swr hooks run and update components.
          ...Array.from(state.queuedRequests?.keys()),
        ];

        mutate((endpointKey) => {
          const swrKey =
            typeof endpointKey === "object" ? endpointKey?.[0] : endpointKey;

          const swrKeyIndex = queuedRequestsUrls.findIndex(
            (url) => url.indexOf(swrKey) > -1
          );
          const isSwrKey = swrKeyIndex > -1;
          if (isSwrKey)
            state.queuedRequests.delete(queuedRequestsUrls[swrKeyIndex]);

          return isSwrKey;
        }).then(() => {
          state.queuedRequests.forEach(({ request: _request, api: _api }) => {
            _request.headers["Authorization"] = `Bearer ${newToken}`;
            _api(_request);
          });

          state.queuedRequests.clear();
          state.isRefreshingToken = false;
        });

        return response;
      });
    })
    .catch(() => {
      state.isRefreshingToken = false;
      authStorage.clearAuthTokens();
      window.location.href = "/login";
      //commented this part. this causes sentry to log server errors. this can lead to excessive noise in our logs. those errors are logged in ESB/CRM backends
      //return Promise.reject(error);
    });
};
