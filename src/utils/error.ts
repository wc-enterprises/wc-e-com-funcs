type OrderErrorCode = 'O_0001';
type ProductErrorCode = 'P_0001' | 'P_0002' | 'P_0003';
type PaymentErrorCode = 'PAY_0001';
type CommonErrorCode = 'COM_0001';
type VariantErrorCode = 'V_0001';

export type ErrorCodes =
  | OrderErrorCode
  | ProductErrorCode
  | PaymentErrorCode
  | CommonErrorCode
  | VariantErrorCode;

export const errorCodeMessages: Record<ErrorCodes, string> = {
  O_0001: 'Order validation failed.',
  P_0001: 'Product validation failed.',
  P_0002: 'Product not found.',
  P_0003: 'Product creation failed',
  V_0001: 'Variant creation failed',
  PAY_0001: 'Payment validation failed.',
  COM_0001: 'Unknown error occured.',
};
