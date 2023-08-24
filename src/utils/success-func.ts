export interface StandardSuccessResponse<T> {
  status: string;
  message: string;
  data: T;
}

export function createSuccessResponse<T>(
  message: string,
  data: T,
): StandardSuccessResponse<T> {
  return {
    status: 'SUCCESS',
    message,
    data,
  };
}
