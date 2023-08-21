import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductAttributeService } from './product-attribute.service';
import { generateRandIds } from 'src/utils/generateRandIds';
import { ProductAttributeDocument } from './documents/product-attribute.document';

@Controller('product-attributes')
export class ProductAttributeController {
  constructor(private readonly productAttributeService: ProductAttributeService) {}

  @Post('create-attribute')
  createAttribute(@Body() data: Omit<ProductAttributeDocument, 'id'>) {
    const id = generateRandIds();

    const attribute: ProductAttributeDocument = {
      id,
      ...data,
    };
    return this.productAttributeService.createAttribute(attribute);
  }

  @Post('create-attributes')
  createAttributes(@Body() data: Omit<ProductAttributeDocument, 'id'>[]) {
    const attributes: ProductAttributeDocument[] = [];

    data.forEach(item => {
      const id = generateRandIds();
      attributes.push({
        id,
        ...item,
      });
    });

    return this.productAttributeService.createAttribute(attributes);
  }

  @Get('fetch-all-attributes')
  fetchAllAttributes() {
    return this.productAttributeService.findAll();
  }

  @Get('fetch-attribute/:id')
  fetchAttribute(@Param('id') id: string) {
    return this.productAttributeService.findOne(id);
  }

  @Patch('update-attribute/:id')
  updateAttribute(@Param('id') id: string, @Body() updateData: Partial<ProductAttributeDocument>) {
    return this.productAttributeService.updateAttribute(id, updateData);
  }

  @Delete('delete-attribute/:id')
  deleteAttribute(@Param('id') id: string) {
    return this.productAttributeService.deleteAttribute(id);
  }
}
