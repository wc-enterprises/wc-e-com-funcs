type OrderErrorCode = 'O_0001';
type ProductErrorCode = 'P_0001' | 'P_0002';
type PaymentErrorCode = 'PAY_0001';
type CommonErrorCode = 'COM_0001';

export type ErrorCodes =
  | OrderErrorCode
  | ProductErrorCode
  | PaymentErrorCode
  | CommonErrorCode;

export const errorCodeMessages: Record<ErrorCodes, string> = {
  O_0001: 'Order validation failed.',
  P_0001: 'Product validation failed.',
  P_0002: 'Product not found.',
  PAY_0001: 'Payment validation failed.',
  COM_0001: 'Unknown error occured.',
};
