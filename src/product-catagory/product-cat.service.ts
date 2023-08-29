import { Injectable, Inject, Logger } from '@nestjs/common';
import { CollectionReference, DocumentSnapshot } from '@google-cloud/firestore';
import { ProductCategoryDocument } from './documents/product-cat.document';
import {
  StandardSuccessResponse,
  createSuccessResponse,
} from 'src/utils/success-func';

@Injectable()
export class ProductCategoryService {
  private logger: Logger = new Logger(ProductCategoryService.name);

  constructor(
    @Inject(ProductCategoryDocument.collectionName)
    private productCollection: CollectionReference<ProductCategoryDocument>,
  ) {}

  async createCategory(
    data: ProductCategoryDocument | ProductCategoryDocument[],
  ): Promise<
    StandardSuccessResponse<
      | Pick<ProductCategoryDocument, 'id' | 'name'>
      | Pick<ProductCategoryDocument, 'id' | 'name'>[]
    >
  > {
    if (Array.isArray(data)) {
      const batch = this.productCollection.firestore.batch();
      const createdCategories: Pick<ProductCategoryDocument, 'id' | 'name'>[] =
        [];

      for (const category of data) {
        const docRef = this.productCollection.doc(category.id);
        batch.set(docRef, category);

        createdCategories.push({ id: category.id, name: category.name });
      }

      await batch.commit();
      return createSuccessResponse(
        'Product categories created successfully',
        createdCategories,
      );
    } else {
      const docRef = this.productCollection.doc(data.id);
      await docRef.set(data);
      return createSuccessResponse('Product category created successfully', {
        id: data.id,
        name: data.name,
      });
    }
  }

  async findOneCategory(
    id: string,
  ): Promise<StandardSuccessResponse<ProductCategoryDocument | null>> {
    const docRef = this.productCollection.doc(id);
    const snapshot: DocumentSnapshot = await docRef.get();

    if (snapshot.exists) {
      return createSuccessResponse(
        'Product category fetched successfully',
        snapshot.data() as ProductCategoryDocument,
      );
    } else {
      return createSuccessResponse('Product category not found', null);
    }
  }

  async findAll(): Promise<ProductCategoryDocument[]> {
    this.logger.log(`Received request to fetch all product categories`);
    const snapshot = await this.productCollection.get();
    const categories: ProductCategoryDocument[] = [];
    snapshot.forEach((doc) => categories.push(doc.data()));
    return categories;
  }

  async updateCategory(
    id: string,
    newData: Partial<ProductCategoryDocument>,
  ): Promise<StandardSuccessResponse<void>> {
    const docRef = this.productCollection.doc(id);
    await docRef.update(newData);
    return createSuccessResponse(
      'Product category updated successfully',
      undefined,
    );
  }

  async deleteCategory(id: string): Promise<StandardSuccessResponse<void>> {
    const docRef = this.productCollection.doc(id);
    await docRef.delete();
    return createSuccessResponse(
      'Product category deleted successfully',
      undefined,
    );
  }
}
