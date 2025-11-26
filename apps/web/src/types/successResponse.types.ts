export interface ISuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
