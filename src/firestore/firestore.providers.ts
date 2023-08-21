import { ProductDocument } from "src/product/documents/product.document";

export const FirestoreDatabaseProvider = 'firestoredb';
export const FirestoreOptionsProvider = 'firestoreOptions';
export const FirestoreCollectionProviders: string[] = [ ProductDocument.collectionName];