import { TProductStatus, TUnits } from 'src/utils/interface';

// Product
export class ProductDocument {
  static collectionName = 'product';

  id: string;
  name: string;
  description: string;
  imagePath: string;
  status: TProductStatus;
  unit: TUnits;
  categoryId: string;
  unitsInStock: number;
}

export class ProductAttributeDocument {
  static collectionName = 'product_attribute';

  id: string;
  productId: string;
  attributeKey: string;
  attributeValue: any;
}

export class ProductCategoryDocument {
  static collectionName = 'product_category';

  id: string;
  name: string;
  description: string;
}

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

// Order
/**
 * Order and order related documents come here.
 */
export class OrderDocument{
    static collectionName = 'order';
  
    id: string;
    customer_id : string;
    status :  'ACTIVE | INACTIVE';
    date_created :string;
    total : number ;
    note ?: string;
}

export class OrderLineItems{
  static collectionName = 'Order_line_items';
  
  id : string;
  order_id : string;
  product_id : string;
  quantity : string;
}

// Payments
/**
 * Payment and payment realted documents come here.
 */
