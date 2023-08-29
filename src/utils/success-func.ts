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

export function createErrorResponse(
  message: string,
): StandardSuccessResponse<null> {
  return {
    status: 'SUCCESS',
    message,
    data: null,
  };
}
