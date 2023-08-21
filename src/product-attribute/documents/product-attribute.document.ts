import { Timestamp } from '@google-cloud/firestore';

export class ProductAttributeDocument {
  static collectionName = 'product_attribute';

  id: string;
  productId: string;
  attributeKey: string;
  attributeValue: any;

}