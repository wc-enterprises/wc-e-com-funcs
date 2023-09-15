import { Injectable } from '@nestjs/common';
import {
  ProductDocument,
  ProductCategoryDocument,
  ProductPricingDocument,
  ProductAttributeDocument,
  ProductVariantDocument,
} from 'src/firestore/documents/firebase.document';
import {
  ICategorizedProducts,
  ICategorizedProductsWithAttributesAndVariants,
  ICreateAttribute,
  ICreateProduct,
  ICreateVariant,
  IProductWithPrice,
  IProductWithPriceVariantsAndAttributes,
  IVariantWithPriceAndAttribute,
} from 'src/utils/interface';
import { ProductCategoryService } from './product-category.service';
import { ProductPricingService } from './product-pricing.service';
import { ProductService } from './product.service';

import { generateRandIds } from 'src/utils/generateRandIds';
import { ProductAttributeService } from './product-attribute.service';
import {
  createErrorResponse,
  createSuccessResponse,
} from 'src/utils/std-response';
import { CustomLoggerService } from 'src/logger/custom-logger.service';
import { ProductVariantService } from './variant.service';

export function frameProductAttributeDocument(
  data: ICreateAttribute[],
  productId: string,
): ProductAttributeDocument[] {
  return data.map((item) => {
    const id = generateRandIds();
    return {
      id,
      productId,
      ...item,
    };
  });
}

@Injectable()
export class ProductAggregateService {
  private logger: CustomLoggerService = new CustomLoggerService(
    ProductAggregateService.name,
  );

  constructor(
    private productService: ProductService,
    private productVariantService: ProductVariantService,
    private productCategoryService: ProductCategoryService,
    private productPricingService: ProductPricingService,
    private productAttributesService: ProductAttributeService,
  ) {}

  async createVariant(requestId: string, data: ICreateVariant) {
    try {
      this.logger.log(
        requestId,
        `Variant creation request received for ${data.productId}`,
      );

      // Get product
      const product = await this.productService.findOne(data.productId);
      if (!product) {
        this.logger.error(requestId, `Product not found`);
        throw { message: 'Product not found.', errorCode: 'P_0002' };
      }

      // Generate variantId.
      const variantId = generateRandIds();

      // Add attributes for the variant.
      const framedProductAttributes = frameProductAttributeDocument(
        data.attributes,
        variantId,
      );
      await this.productAttributesService.create(
        requestId,
        framedProductAttributes,
      );

      // Store pricing if present for variant
      if (data.pricing) {
        const pricingId = generateRandIds();
        const pricingDoc: ProductPricingDocument = {
          id: pricingId,
          productId: variantId,
          status: 'ACTIVE',
          dateCreated: new Date().toString(),
          ...data.pricing,
        };
        await this.productPricingService.createPricing(pricingDoc);
      }

      const variant: ProductVariantDocument = {
        ...product,
        id: variantId,
        productId: data.productId,
      };
      await this.productVariantService.create(requestId, variant);
      this.logger.log(requestId, `Variant created succesfully`);

      return createSuccessResponse('Variant created successfully', {
        id: variantId,
        name: data.name ?? product.name,
        productId: data.productId,
      });
    } catch (err) {
      this.logger.error(requestId, `Variant creation failed: ${err.message}`);
      return createErrorResponse(err.errorCode ?? 'V_0001');
    }
  }

  async createProduct(requestId: string, data: ICreateProduct) {
    try {
      this.logger.log(
        requestId,
        `Received request to create product for ${data.name}`,
      );
      const id = generateRandIds();
      if (data.attributes) {
        const framedProductAttributes = frameProductAttributeDocument(
          data.attributes,
          id,
        );
        await this.productAttributesService.create(
          requestId,
          framedProductAttributes,
        );
      }

      const product: ProductDocument = {
        id,
        categoryId: data.categoryId,
        description: data.description,
        imagePath: data.imagePath,
        name: data.name,
        status: 'ACTIVE',
        unit: data.unit,
        unitsInStock: data.unitsInStock,
      };

      await this.productService.create(product);

      const pricingId = generateRandIds();
      const productPriceDoc: ProductPricingDocument = {
        id: pricingId,
        productId: id,
        status: 'ACTIVE',
        dateCreated: new Date().toString(),
        ...data.pricing,
      };

      await this.productPricingService.createPricing(productPriceDoc);

      this.logger.log(
        requestId,
        `Product created successfully ${JSON.stringify({
          id,
          name: data.name,
        })}`,
      );

      return createSuccessResponse('Product created successfully', {
        id,
        name: data.name,
      });
    } catch (err) {
      this.logger.error(requestId, `Product creation failed: ${err.message}`);
      return createErrorResponse('P_0003');
    }
  }

  async getCategorisedProducts(
    requestId: string,
  ): Promise<ICategorizedProducts[]> {
    const products: ProductDocument[] = await this.productService.findAll();

    const categories: ProductCategoryDocument[] =
      await this.productCategoryService.findAll(requestId);

    const productPricing: ProductPricingDocument[] =
      await this.productPricingService.findAll();

    const categorizedProducts: ICategorizedProducts[] = [];

    // Create a map to store products by category ID
    const productsByCategory: { [categoryId: string]: IProductWithPrice[] } =
      {};

    // Populate the productsByCategory map
    products.forEach((product) => {
      if (!productsByCategory[product.categoryId]) {
        productsByCategory[product.categoryId] = [];
      }

      const pricing = productPricing.find(
        (pricing) => pricing.productId === product.id,
      );
      const productData: IProductWithPrice = {
        id: product.id,
        name: product.name,
        description: product.description,
        imagePath: product.imagePath,
        unit: product.unit,
        unitsInStock: product.unitsInStock,
        pricingId: pricing ? pricing.id : '',
        sellingPrice: pricing ? pricing.sellingPrice : '0',
        discount: pricing ? pricing.discount : '0',
        discountUnit: pricing ? pricing.discountUnit : 'percentage',
      };

      productsByCategory[product.categoryId].push(productData);
    });

    // Create categorized products
    categories.forEach((category) => {
      const productsInCategory = productsByCategory[category.id] || [];
      const categorizedProduct: ICategorizedProducts = {
        categoryId: category.id,
        categoryName: category.name,
        categoryDescription: category.description,
        products: productsInCategory,
      };

      categorizedProducts.push(categorizedProduct);
    });

    return categorizedProducts;
  }

  async getCategorisedProductsWithAttributesAndVariants(
    requestId: string,
  ): Promise<ICategorizedProductsWithAttributesAndVariants[]> {
    const products: ProductDocument[] = await this.productService.findAll();

    const categories: ProductCategoryDocument[] =
      await this.productCategoryService.findAll(requestId);

    const totalPricing: ProductPricingDocument[] =
      await this.productPricingService.findAll();

    const totalAttributes: ProductAttributeDocument[] =
      await this.productAttributesService.findAll();

    const totalVariants: ProductVariantDocument[] =
      await this.productVariantService.findAll(requestId);

    const categorizedProducts: ICategorizedProductsWithAttributesAndVariants[] =
      [];

    // Create a map to store products by category ID
    const productsByCategory: {
      [categoryId: string]: IProductWithPriceVariantsAndAttributes[];
    } = {};

    // Populate the productsByCategory map
    products.forEach((product) => {
      if (!productsByCategory[product.categoryId]) {
        productsByCategory[product.categoryId] = [];
      }

      const pricing = totalPricing.find(
        (pricing) => pricing.productId === product.id,
      );

      const attributes = totalAttributes.filter(
        (item) => item.productId === product.id,
      );

      const variantWithAttributeAndPrice = [];
      const variants = totalVariants.filter(
        (variant) => variant.productId === product.id,
      );
      if (variants.length) {
        variants.forEach((variant) => {
          const variantPricing = totalPricing.find(
            (item) => item.id === variant.id,
          );

          const variantAttributes = totalAttributes.filter(
            (item) => item.productId === variant.id,
          );

          const variantWithPrice: IVariantWithPriceAndAttribute = {
            ...variant,
            pricingId: variantPricing?.id ?? pricing.id,
            sellingPrice: variantPricing?.sellingPrice ?? pricing.sellingPrice,
            discount: variantPricing?.discount ?? pricing.discount,
            discountUnit: variantPricing?.discountUnit ?? pricing.discountUnit,
            attributes: variantAttributes.map((item) => {
              return {
                key: item.key,
                value: item.value,
                asset: item.asset,
              };
            }),
          };

          variantWithAttributeAndPrice.push(variantWithPrice);
        });
      }

      const productData: IProductWithPriceVariantsAndAttributes = {
        id: product.id,
        name: product.name,
        description: product.description,
        imagePath: product.imagePath,
        unit: product.unit,
        unitsInStock: product.unitsInStock,
        pricingId: pricing ? pricing.id : '',
        sellingPrice: pricing ? pricing.sellingPrice : '0',
        discount: pricing ? pricing.discount : '0',
        discountUnit: pricing ? pricing.discountUnit : 'percentage',

        attributes: attributes.map((item) => {
          return {
            key: item.key,
            value: item.value,
            asset: item.asset,
          };
        }),

        variants: variantWithAttributeAndPrice,
      };

      productsByCategory[product.categoryId].push(productData);
    });

    // Create categorized products
    categories.forEach((category) => {
      const productsInCategory = productsByCategory[category.id] || [];
      const categorizedProduct: ICategorizedProductsWithAttributesAndVariants =
        {
          categoryId: category.id,
          categoryName: category.name,
          categoryDescription: category.description,
          products: productsInCategory,
        };

      categorizedProducts.push(categorizedProduct);
    });

    return categorizedProducts;
  }
}
