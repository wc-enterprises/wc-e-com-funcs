import {
  ProductAttributeDocument,
  ProductCategoryDocument,
  ProductDocument,
  ProductPricingDocument,
  ProductVariantDocument,
} from 'src/firestore/documents/firebase.document';

export const FirestoreDatabaseProvider = 'firestoredb';
export const FirestoreOptionsProvider = 'firestoreOptions';
export const FirestoreCollectionProviders: string[] = [
  ProductDocument.collectionName,
  ProductCategoryDocument.collectionName,
  ProductPricingDocument.collectionName,
  ProductAttributeDocument.collectionName,
  ProductVariantDocument.collectionName,
];
