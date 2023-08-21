import { ProductAttributeDocument } from "src/product-attribute/documents/product-attribute.document";
import { ProductCategoryDocument } from "src/product-catagory/documents/product-cat.document";
import { ProductPricingDocument } from "src/product-pricing/documents/product-pricing.document";
import { ProductDocument } from "src/product/documents/product.document";

export const FirestoreDatabaseProvider = 'firestoredb';
export const FirestoreOptionsProvider = 'firestoreOptions';
export const FirestoreCollectionProviders: string[] = [ ProductDocument.collectionName, ProductCategoryDocument.collectionName, ProductPricingDocument.collectionName, ProductAttributeDocument.collectionName];