import {
    Injectable,
    Inject,
    Logger,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { CollectionReference, DocumentSnapshot, Timestamp } from '@google-cloud/firestore';
  import { ProductCategoryDocument } from './documents/product-cat.document';
  
  @Injectable()
  export class ProductCategoryService {
    private logger: Logger = new Logger(ProductCategoryService.name);
  
    constructor(
      @Inject(ProductCategoryDocument.collectionName)
      private productCollection: CollectionReference<ProductCategoryDocument>,
    ) {}
  
    async createCategory(data: ProductCategoryDocument | ProductCategoryDocument[]): Promise<Pick<ProductCategoryDocument, 'id' | 'name'> | Pick<ProductCategoryDocument, 'id' | 'name'>[]> {
      if (Array.isArray(data)) {
        const batch = this.productCollection.firestore.batch();
        const createdCategories: Pick<ProductCategoryDocument, 'id' | 'name'>[] = [];
  
        for (const category of data) {
          const docRef = this.productCollection.doc(category.id);
          batch.set(docRef, category);
  
          createdCategories.push({ id: category.id, name: category.name });
        }
  
        await batch.commit();
        return createdCategories;
      } else {
        const docRef = this.productCollection.doc(data.id);
        await docRef.set(data);
        return { id: data.id, name: data.name };
      }
    }

    async findOneCategory(id: string): Promise<ProductCategoryDocument | null> {
      const docRef = this.productCollection.doc(id);
      const snapshot: DocumentSnapshot = await docRef.get();
      
      if (snapshot.exists) {
        return snapshot.data() as ProductCategoryDocument;
      } else {
        return null;
      }
    }
  
    async findAll(): Promise<ProductCategoryDocument[]> {
      const snapshot = await this.productCollection.get();
      const categories: ProductCategoryDocument[] = [];
      snapshot.forEach(doc => categories.push(doc.data()));
      return categories;
    }
  
    async updateCategory(id: string, newData: Partial<ProductCategoryDocument>): Promise<void> {
      const docRef = this.productCollection.doc(id);
      await docRef.update(newData);
    }
  
    async deleteCategory(id: string): Promise<void> {
      const docRef = this.productCollection.doc(id);
      await docRef.delete();
    }
    
  }