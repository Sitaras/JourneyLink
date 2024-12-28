import axios from "axios";
import { requestInterceptor, responseInterceptor } from "./interceptors";

export const fetcher = (url: string) => api.get(url).then((res) => res.data);
export const postFetcher = (url: string, params: unknown) => {
  return api.post(url, params).then((res) => res.data);
};

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use(
  function (config) {
    return requestInterceptor(config);
  },
  function (error) {
    throw error;
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    return responseInterceptor(error, api);
  }
);

export default api;
