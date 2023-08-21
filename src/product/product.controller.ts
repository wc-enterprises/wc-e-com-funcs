import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { generateRandIds } from 'src/utils/generateRandIds';
import { ProductDocument } from './documents/product.document';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create-product')
  createProduct(@Body() data: Omit<ProductDocument, 'id'>) {
    const id = generateRandIds();

    const product: ProductDocument = {
        id, 
        ...data
    };
    return this.productService.createProduct(product);
  }

  @Post('create-products')
  createProducts(@Body() data: Omit<ProductDocument, 'id'>[]) {
    const products: ProductDocument[] = [];

    data.forEach(item=>{
        const id = generateRandIds();
        products.push({
            id,
            ...item
        });
    });
  
    return this.productService.createProduct(products);
  }
}
