export interface IErrorResponse {
  success: boolean;
  message: string;
  error?: any;
  stack?: string;
}

export interface CustomErrorResponse {
  error: (message: string, statusCode?: number, error?: any) => void;
}
