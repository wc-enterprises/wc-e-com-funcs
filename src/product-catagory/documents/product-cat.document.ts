import { Timestamp } from '@google-cloud/firestore';

export class ProductCategoryDocument {
  static collectionName = 'product_category';

  id: string;
  name: string;
  description: string;
}