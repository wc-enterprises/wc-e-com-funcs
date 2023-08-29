import { TProductStatus, TUnits } from 'src/utils/interface';

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
