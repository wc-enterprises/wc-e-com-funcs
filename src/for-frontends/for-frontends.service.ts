import { Injectable, Logger } from '@nestjs/common';
import { ProductCategoryDocument } from 'src/product-catagory/documents/product-cat.document';
import { ProductCategoryService } from 'src/product-catagory/product-cat.service';
import { ProductPricingDocument } from 'src/product-pricing/documents/product-pricing.document';
import { ProductPricingService } from 'src/product-pricing/product-pricing.service';
import { ProductDocument } from 'src/product/documents/product.document';
import { ProductService } from 'src/product/product.service';
import { TDiscountUnits, TUnits } from 'src/utils/interface';

export interface ICategorizedProducts {
  categoryId: string;
  categoryName: string;
  categoryDescription: string;
  products: IProduct[];
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  imagePath: string;
  unit: TUnits;
  unitsInStock: number;
  pricingId: string;
  sellingPrice: string;
  discount: string;
  discountUnit: TDiscountUnits;
}

@Injectable()
export class ForFrontendService {
  private logger: Logger = new Logger(ForFrontendService.name);

  constructor(
    private productService: ProductService,
    private productCategoryService: ProductCategoryService,
    private productPricingService: ProductPricingService,
  ) {}

  async getCategorisedProducts(): Promise<ICategorizedProducts[]> {
    const products: ProductDocument[] = await this.productService.findAll();

    const categories: ProductCategoryDocument[] =
      await this.productCategoryService.findAll();

    const productPricing: ProductPricingDocument[] =
      await this.productPricingService.findAll();

    const categorizedProducts: ICategorizedProducts[] = [];

    // Create a map to store products by category ID
    const productsByCategory: { [categoryId: string]: IProduct[] } = {};

    // Populate the productsByCategory map
    products.forEach((product) => {
      if (!productsByCategory[product.categoryId]) {
        productsByCategory[product.categoryId] = [];
      }

      const pricing = productPricing.find(
        (pricing) => pricing.productId === product.id,
      );
      const productData: IProduct = {
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
