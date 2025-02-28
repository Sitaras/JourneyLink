import authStorage from "@/storage/authStorage";
import wretch from "wretch";

export const api = wretch(process.env.NEXT_PUBLIC_BASE_URL).errorType("json")

export const authApi = wretch(process.env.NEXT_PUBLIC_BASE_URL)
  .auth(`Bearer ${authStorage.getAccessToken()}`)
  .errorType("json");

export const fetcher = <IResponse>(url: string): Promise<IResponse> => {
  return authApi.get(url).json((json) => json?.data);
};

export const postFetcher = <IBody, IResponse>(
  url: string,
  body: IBody
): Promise<IResponse> =>
  authApi
    .url(url)
    .post(body)
    .json((json) => json?.data);
