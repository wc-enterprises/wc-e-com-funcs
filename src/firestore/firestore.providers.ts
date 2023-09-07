import {
  ProductAttributeDocument,
  ProductCategoryDocument,
  ProductDocument,
  ProductPricingDocument,
  OrderDocument,
  OrderLineItems
} from 'src/firestore/documents/firebase.document';

export const FirestoreDatabaseProvider = 'firestoredb';
export const FirestoreOptionsProvider = 'firestoreOptions';
export const FirestoreCollectionProviders: string[] = [
  ProductDocument.collectionName,
  ProductCategoryDocument.collectionName,
  ProductPricingDocument.collectionName,
  ProductAttributeDocument.collectionName,
  OrderDocument.collectionName,
  OrderLineItems.collectionName
];
