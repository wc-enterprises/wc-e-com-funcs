export class ProductPricingDocument {
  static collectionName = 'product_pricing';

  id: string;
  productId: string;
  basePrice: string;
  sellingPrice: string;
  dateCreated: string;
  status: 'ACTIVE' | 'INACTIVE';
  discount: string;
  discountUnit: 'percentage' | 'rupees';
}
