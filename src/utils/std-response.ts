import { ErrorCodes, errorCodeMessages } from './error';

export interface StandardResponse<T> {
  status: string;
  message: string;
  data: T;
  errorCodes?: string[];
}

export function createSuccessResponse<T>(
  message: string,
  data: T,
): StandardResponse<T> {
  return {
    status: 'SUCCESS',
    message,
    data,
  };
}

export function createErrorResponse(
  errorCodes: ErrorCodes | ErrorCodes[] = 'COM_0001',
): StandardResponse<null> {
  const normalizedErrorCodes = Array.isArray(errorCodes)
    ? errorCodes
    : [errorCodes];

  const message = normalizedErrorCodes
    .map((code) => errorCodeMessages[code] || 'Unknown error')
    .join(', ');

  return {
    status: 'ERROR',
    message,
    data: null,
    errorCodes: normalizedErrorCodes,
  };
}
