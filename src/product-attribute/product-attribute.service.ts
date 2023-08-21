import { Injectable, Inject, Logger } from '@nestjs/common';
import { CollectionReference, DocumentSnapshot } from '@google-cloud/firestore';
import { ProductAttributeDocument } from './documents/product-attribute.document';

@Injectable()
export class ProductAttributeService {
  private logger: Logger = new Logger(ProductAttributeService.name);

  constructor(
    @Inject(ProductAttributeDocument.collectionName)
    private attributeCollection: CollectionReference<ProductAttributeDocument>,
  ) {}

  async createAttribute(data: ProductAttributeDocument | ProductAttributeDocument[]) {
    if (Array.isArray(data)) {
      const batch = this.attributeCollection.firestore.batch();
      const createdAttributes: Pick<ProductAttributeDocument, 'id' | 'productId' | 'attributeKey'>[] = [];

      for (const attribute of data) {
        const docRef = this.attributeCollection.doc(attribute.id);
        batch.set(docRef, attribute);

        createdAttributes.push({ id: attribute.id, productId: attribute.productId, attributeKey: attribute.attributeKey });
      }

      await batch.commit();
      return createdAttributes;
    } else {
      const docRef = this.attributeCollection.doc(data.id);
      await docRef.set(data);
      return { id: data.id, productId: data.productId, attributeKey: data.attributeKey };
    }
  }

  async findAll(): Promise<ProductAttributeDocument[]> {
    const snapshot = await this.attributeCollection.get();
    const attributes: ProductAttributeDocument[] = [];
    snapshot.forEach(doc => attributes.push(doc.data()));
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

  async updateAttribute(id: string, newData: Partial<ProductAttributeDocument>): Promise<void> {
    const docRef = this.attributeCollection.doc(id);
    await docRef.update(newData);
  }

  async deleteAttribute(id: string): Promise<void> {
    const docRef = this.attributeCollection.doc(id);
    await docRef.delete();
  }
}
