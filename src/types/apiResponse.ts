export type IApiResponseSuccess<T> = {
  success: true;
  status: number;
  message: string;
  data: T;
};

export type IApiResponseError = {
  success: false;
  status: number;
  error: string;
  details?: string;
};
