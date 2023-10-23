import { Injectable, Inject } from '@nestjs/common';
import { CollectionReference, DocumentSnapshot } from '@google-cloud/firestore';
import {
  StandardResponse,
  createSuccessResponse,
} from 'src/utils/std-response';
import { CustomLoggerService } from 'src/logger/custom-logger.service';
import { ProductVariantDocument } from 'src/firestore/documents/firebase.document';

@Injectable()
export class ProductVariantService {
  private logger: CustomLoggerService;

  constructor(
    @Inject(ProductVariantDocument.collectionName)
    private productVariantCollection: CollectionReference<ProductVariantDocument>,
  ) {
    this.logger = new CustomLoggerService('PRODUCT_VARIANT_SERVICE');
  }

  async create(
    requestId: string,
    data: ProductVariantDocument | ProductVariantDocument[],
  ): Promise<
    StandardResponse<
      | Pick<ProductVariantDocument, 'id' | 'name'>
      | Pick<ProductVariantDocument, 'id' | 'name'>[]
    >
  > {
    this.logger.log(
      requestId,
      `Received request to create variant for ${JSON.stringify(data)}`,
    );
    if (Array.isArray(data)) {
      const batch = this.productVariantCollection.firestore.batch();
      const createdVariants: Pick<ProductVariantDocument, 'id' | 'name'>[] = [];

      for (const variant of data) {
        const docRef = this.productVariantCollection.doc(variant.id);
        batch.set(docRef, variant);

        createdVariants.push({ id: variant.id, name: variant.name });
      }

      await batch.commit();
      return createSuccessResponse(
        'Product variants created successfully',
        createdVariants,
      );
    } else {
      const docRef = this.productVariantCollection.doc(data.id);
      await docRef.set(data);
      return createSuccessResponse('Product variant created successfully', {
        id: data.id,
        name: data.name,
      });
    }
  }

  async findOne(
    id: string,
  ): Promise<StandardResponse<ProductVariantDocument | null>> {
    const docRef = this.productVariantCollection.doc(id);
    const snapshot: DocumentSnapshot = await docRef.get();

    if (snapshot.exists) {
      return createSuccessResponse(
        'Product variant fetched successfully',
        snapshot.data() as ProductVariantDocument,
      );
    } else {
      return createSuccessResponse('Product variant not found', null);
    }
  }

  async findAll(requestId: string): Promise<ProductVariantDocument[]> {
    this.logger.log(
      requestId,
      `Received request to fetch all product variants`,
    );
    const snapshot = await this.productVariantCollection.get();
    const variants: ProductVariantDocument[] = [];
    snapshot.forEach((doc) =>
      variants.push(doc.data() as ProductVariantDocument),
    );
    return variants;
  }

  async getVariantsOfAProduct(
    productId: string,
  ): Promise<ProductVariantDocument[]> {
    const snapshot = await this.productVariantCollection
      .where('productId', '==', productId)
      .get();
    const variants: ProductVariantDocument[] = [];

    snapshot.forEach((doc) => {
      const variant = doc.data() as ProductVariantDocument;
      variants.push(variant);
    });

    return variants;
  }

  async update(
    id: string,
    newData: Partial<ProductVariantDocument>,
  ): Promise<StandardResponse<void>> {
    const docRef = this.productVariantCollection.doc(id);
    await docRef.update(newData);
    return createSuccessResponse(
      'Product variant updated successfully',
      undefined,
    );
  }

  async delete(id: string): Promise<StandardResponse<void>> {
    const docRef = this.productVariantCollection.doc(id);
    await docRef.delete();
    return createSuccessResponse(
      'Product variant deleted successfully',
      undefined,
    );
  }
}
