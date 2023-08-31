import { Injectable, Logger } from '@nestjs/common';
import {
  ProductDocument,
  ProductCategoryDocument,
  ProductPricingDocument,
} from 'src/firestore/documents/firebase.document';
import { ICategorizedProducts, IProductWithPrice } from 'src/utils/interface';
import { ProductCategoryService } from './product-category.service';
import { ProductPricingService } from './product-pricing.service';
import { ProductService } from './product.service';

@Injectable()
export class ProductAggregateService {
  private logger: Logger = new Logger(ProductAggregateService.name);

  constructor(
    private productService: ProductService,
    private productCategoryService: ProductCategoryService,
    private productPricingService: ProductPricingService,
  ) {}

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
}
