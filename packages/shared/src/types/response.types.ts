export interface ISuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface CustomSuccessResponse<T> {
  success: (data: T, message?: string, statusCode?: number) => void;
}
