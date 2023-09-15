import { Injectable, Inject } from '@nestjs/common';
import { CollectionReference, DocumentSnapshot } from '@google-cloud/firestore';
import { ProductAttributeDocument } from '../../../firestore/documents/firebase.document';
import { CustomLoggerService } from 'src/logger/custom-logger.service';

@Injectable()
export class ProductAttributeService {
  private logger: CustomLoggerService = new CustomLoggerService(
    ProductAttributeService.name,
  );

  constructor(
    @Inject(ProductAttributeDocument.collectionName)
    private attributeCollection: CollectionReference<ProductAttributeDocument>,
  ) {}

  async create(
    requestId: string,
    data: ProductAttributeDocument | ProductAttributeDocument[],
  ) {
    this.logger.log(
      requestId,
      `Received request to create product attribute for ${JSON.stringify(
        data,
      )}.`,
    );
    if (Array.isArray(data)) {
      const batch = this.attributeCollection.firestore.batch();
      const createdAttributes: Pick<
        ProductAttributeDocument,
        'id' | 'productId' | 'key'
      >[] = [];

      for (const attribute of data) {
        const docRef = this.attributeCollection.doc(attribute.id);
        batch.set(docRef, attribute);

        createdAttributes.push({
          id: attribute.id,
          productId: attribute.productId,
          key: attribute.key,
        });
      }

      await batch.commit();
      return createdAttributes;
    } else {
      const docRef = this.attributeCollection.doc(data.id);
      await docRef.set(data);
      return {
        id: data.id,
        productId: data.productId,
        key: data.key,
      };
    }
  }

  async findAll(): Promise<ProductAttributeDocument[]> {
    const snapshot = await this.attributeCollection.get();
    const attributes: ProductAttributeDocument[] = [];
    snapshot.forEach((doc) => attributes.push(doc.data()));
    return attributes;
  }

  async findOne(id: string): Promise<ProductAttributeDocument | null> {
    const docRef = this.attributeCollection.doc(id);
    const snapshot: DocumentSnapshot = await docRef.get();

    if (snapshot.exists) {
      return snapshot.data() as ProductAttributeDocument;
    } else {
      return null;
    }
  }

  async update(
    id: string,
    newData: Partial<ProductAttributeDocument>,
  ): Promise<void> {
    const docRef = this.attributeCollection.doc(id);
    await docRef.update(newData);
  }

  async delete(id: string): Promise<void> {
    const docRef = this.attributeCollection.doc(id);
    await docRef.delete();
  }
}
