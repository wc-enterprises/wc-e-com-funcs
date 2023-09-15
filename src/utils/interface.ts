export const UNITS = ['unit', 'kg', 'packet'] as const;
export type TUnits = (typeof UNITS)[number];

const STATUS = ['ACTIVE', 'INACTIVE'] as const;
export type TProductPricingStatus = (typeof STATUS)[number];
export type TProductStatus = (typeof STATUS)[number];

const DISCOUNT_UNITS = ['percentage', 'rupees'] as const;
export type TDiscountUnits = (typeof DISCOUNT_UNITS)[number];

export interface ICategorizedProducts {
  categoryId: string;
  categoryName: string;
  categoryDescription: string;
  products: IProductWithPrice[];
}

export interface IProductWithPrice {
  id: string;
  name: string;
  description: string;
  imagePath: string;
  unit: TUnits;
  unitsInStock: number;
  pricingId: string;
  sellingPrice: string;
  discount: string;
  discountUnit: TDiscountUnits;
}

export interface ICategorizedProductsWithAttributesAndVariants {
  categoryId: string;
  categoryName: string;
  categoryDescription: string;
  products: IProductWithPriceVariantsAndAttributes[];
}

export interface IProductWithPriceVariantsAndAttributes {
  id: string;
  name: string;
  description: string;
  imagePath: string;
  unit: TUnits;
  unitsInStock: number;
  pricingId: string;
  sellingPrice: string;
  discount: string;
  discountUnit: TDiscountUnits;

  attributes: IAttribute[] | null;

  variants: IVariantWithPriceAndAttribute[] | null;
}

export interface IVariantWithPriceAndAttribute {
  id: string;
  productId: string;
  name: string;
  description: string;
  imagePath: string;
  unit: TUnits;
  unitsInStock: number;
  pricingId: string;
  sellingPrice: string;
  discount: string;
  discountUnit: TDiscountUnits;

  attributes: IAttribute[] | null;
}

export interface ICreatePricing {
  basePrice: string;
  sellingPrice: string;
  discount: string;
  discountUnit: TDiscountUnits;
}

export interface ICreateProduct {
  name: string;
  description: string;
  imagePath: string;
  unit: TUnits;
  categoryId: string;
  unitsInStock: number;

  pricing: ICreatePricing;

  attributes?: ICreateAttribute[];
}

export interface ICreateAttribute {
  key: string;
  value: string;
  asset: string;
}
export interface IAttribute extends ICreateAttribute {}

export interface ICreateVariant {
  productId: string;
  attributes: ICreateAttribute[];

  //Optional Params.
  name?: string;
  description?: string;
  imagePath?: string;
  status?: TProductStatus;
  unit?: TUnits;
  unitsInStock?: number;

  pricing?: ICreatePricing;
}
