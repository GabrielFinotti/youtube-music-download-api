import {
  IApiResponseError,
  IApiResponseSuccess,
} from '../../types/apiResponse';

class ApiResponse {
  static success<T>(
    status: number,
    message: string,
    data: T
  ): IApiResponseSuccess<T> {
    return {
      success: true,
      status,
      message,
      data,
    };
  }

  static error(
    status: number,
    error: string,
    details?: string
  ): IApiResponseError {
    return {
      success: false,
      status,
      error,
      details,
    };
  }
}

export default ApiResponse;
