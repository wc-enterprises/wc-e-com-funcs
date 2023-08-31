import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductService } from '../logics/product.service';
import { generateRandIds } from 'src/utils/generateRandIds';
import { ProductDocument } from '../../../firestore/documents/firebase.document';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create-product')
  createProduct(@Body() data: Omit<ProductDocument, 'id'>) {
    const id = generateRandIds();

    const product: ProductDocument = {
      id,
      ...data,
    };
    return this.productService.createProduct(product);
  }

  @Post('create-products')
  createProducts(@Body() data: Omit<ProductDocument, 'id'>[]) {
    const products: ProductDocument[] = [];

    data.forEach((item) => {
      const id = generateRandIds();
      products.push({
        id,
        ...item,
      });
    });

    return this.productService.createProduct(products);
  }

  @Get('fetch-all-products')
  fetchAllProducts() {
    return this.productService.findAll();
  }

  @Patch('update-product/:id')
  updateProduct(
    @Param('id') id: string,
    @Body() updateData: Partial<ProductDocument>,
  ) {
    console.log('id', id);
    console.log('updateData', updateData);
    return this.productService.updateProduct(id, updateData);
  }

  @Delete('delete-product/:id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
