export interface SuccessResponse {
  message: any;
  status: number;
  success: boolean;
  result?: any;
}

export interface ErrorResponse {
  message: string;
  success: boolean;
  status: number;
}
