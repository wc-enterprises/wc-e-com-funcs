import { Injectable, Inject, Logger } from '@nestjs/common';
import { CollectionReference } from '@google-cloud/firestore';
import { ProductDocument } from '../../../firestore/documents/firebase.document';
import {
  StandardResponse,
  createSuccessResponse,
} from 'src/utils/std-response';

@Injectable()
export class ProductService {
  private logger: Logger = new Logger(ProductService.name);

  constructor(
    @Inject(ProductDocument.collectionName)
    private productCollection: CollectionReference<ProductDocument>,
  ) {}

  async createProduct(
    data: ProductDocument | ProductDocument[],
  ): Promise<
    StandardResponse<
      | Pick<ProductDocument, 'id' | 'name'>
      | Pick<ProductDocument, 'id' | 'name'>[]
    >
  > 
  {
    if (Array.isArray(data)) {
      const batch = this.productCollection.firestore.batch();
      const createdProducts: Pick<ProductDocument, 'id' | 'name'>[] = [];

      for (const product of data) {
        const docRef = this.productCollection.doc(product.id);
        batch.set(docRef, product);

        createdProducts.push({ id: product.id, name: product.name });
      }

      await batch.commit();
      return createSuccessResponse(
        'Products created successfully',
        createdProducts,
      );
    } else {
      const docRef = this.productCollection.doc(data.id);
      await docRef.set(data);
      return createSuccessResponse('Product created successfully', {
        id: data.id,
        name: data.name,
      });
    }
  }

  async findAll(): Promise<ProductDocument[]> {
    const snapshot = await this.productCollection.get();
    const products: ProductDocument[] = [];
    snapshot.forEach((doc) => products.push(doc.data()));
    return products;
  }

  async updateProduct(
    id: string,
    newData: Partial<ProductDocument>,
  ): Promise<void> {
    const docRef = this.productCollection.doc(id);
    await docRef.update(newData);
  }

  async deleteProduct(id: string): Promise<void> {
    const docRef = this.productCollection.doc(id);
    await docRef.delete();
  }
}
