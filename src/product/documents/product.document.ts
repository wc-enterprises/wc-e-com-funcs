import { Timestamp } from '@google-cloud/firestore';

export class ProductDocument {
  static collectionName = 'product';

  id: string;
  name: string;
  description: string;
  imagePath: string;
  status: 'ACTIVE' | 'INACTIVE';
  unit: 'kg' | 'unit' | 'package';
  categoryId: string;
  unitsInStock: number;
}