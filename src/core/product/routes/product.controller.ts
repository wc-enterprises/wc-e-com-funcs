import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ProductService } from '../logics/product.service';
import { generateRandIds } from 'src/utils/generateRandIds';
import { ProductDocument } from '../../../firestore/documents/firebase.document';
import { ProductAggregateService } from '../logics/product-aggregate.service';
import { ICreateProduct, ICreateVariant } from 'src/utils/interface';

@Controller()
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly PAS: ProductAggregateService,
  ) {}

  @Post('create-product')
  createProduct(
    @Req() request: { requestId: string },
    @Body() data: ICreateProduct,
  ) {
    return this.PAS.createProduct(request.requestId, data);
  }

  @Post('create-variant')
  createVariant(
    @Req() request: { requestId: string },
    @Body() data: ICreateVariant,
  ) {
    return this.PAS.createVariant(request.requestId, data);
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

    return this.productService.create(products);
  }

  @Get('fetch-all-products')
  fetchAllProducts() {
    return this.productService.findAll();
  }

  @Get('fetch-one-product/:id')
  fetchOneProduct(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch('update-product/:id')
  updateProduct(
    @Param('id') id: string,
    @Body() updateData: Partial<ProductDocument>,
  ) {
    console.log('id', id);
    console.log('updateData', updateData);
    return this.productService.update(id, updateData);
  }

  @Delete('delete-product/:id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
