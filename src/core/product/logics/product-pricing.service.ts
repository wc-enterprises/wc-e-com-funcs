import { Injectable, Inject, Logger } from '@nestjs/common';
import { CollectionReference, DocumentSnapshot } from '@google-cloud/firestore';
import { ProductPricingDocument } from '../../../firestore/documents/firebase.document';

@Injectable()
export class ProductPricingService {
  private logger: Logger = new Logger(ProductPricingService.name);

  constructor(
    @Inject(ProductPricingDocument.collectionName)
    private pricingCollection: CollectionReference<ProductPricingDocument>,
  ) {}

  async createPricing(
    data: ProductPricingDocument | ProductPricingDocument[],
  ): Promise<
    | Pick<ProductPricingDocument, 'id' | 'productId' | 'basePrice'>
    | Pick<ProductPricingDocument, 'id' | 'productId' | 'basePrice'>[]
  > {
    if (Array.isArray(data)) {
      const batch = this.pricingCollection.firestore.batch();
      const createdPricings: Pick<
        ProductPricingDocument,
        'id' | 'productId' | 'basePrice'
      >[] = [];

      for (const pricing of data) {
        const docRef = this.pricingCollection.doc(pricing.id);
        batch.set(docRef, pricing);

        createdPricings.push({
          id: pricing.id,
          productId: pricing.productId,
          basePrice: pricing.basePrice,
        });
      }

      await batch.commit();
      return createdPricings;
    } else {
      const docRef = this.pricingCollection.doc(data.id);
      await docRef.set(data);
      return {
        id: data.id,
        productId: data.productId,
        basePrice: data.basePrice,
      };
    }
  }

  async findAll(): Promise<ProductPricingDocument[]> {
    const snapshot = await this.pricingCollection.get();
    const pricings: ProductPricingDocument[] = [];
    snapshot.forEach((doc) => pricings.push(doc.data()));
    return pricings;
  }

  async findOne(id: string): Promise<ProductPricingDocument | null> {
    const docRef = this.pricingCollection.doc(id);
    const snapshot: DocumentSnapshot = await docRef.get();

    if (snapshot.exists) {
      return snapshot.data() as ProductPricingDocument;
    } else {
      return null;
    }
  }

  async getPricingOfAProduct(
    productId: string,
  ): Promise<ProductPricingDocument> {
    const snapshot = await this.pricingCollection
      .where('productId', '==', productId)
      .get();

    let pricing: ProductPricingDocument | null = null;

    snapshot.forEach((doc) => {
      pricing = doc.data() as ProductPricingDocument;
    });

    return pricing;
  }

  async updatePricing(
    id: string,
    newData: Partial<ProductPricingDocument>,
  ): Promise<void> {
    const docRef = this.pricingCollection.doc(id);
    await docRef.update(newData);
  }

  async deletePricing(id: string): Promise<void> {
    const docRef = this.pricingCollection.doc(id);
    await docRef.delete();
  }
}
