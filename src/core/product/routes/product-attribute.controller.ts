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
import { ProductAttributeService } from '../logics/product-attribute.service';
import { generateRandIds } from 'src/utils/generateRandIds';
import { ProductAttributeDocument } from '../../../firestore/documents/firebase.document';

@Controller('product-attributes')
export class ProductAttributeController {
  constructor(
    private readonly productAttributeService: ProductAttributeService,
  ) {}

  @Post('create')
  createAttribute(
    @Req() request: { requestId: string },
    @Body() data: Omit<ProductAttributeDocument, 'id'>,
  ) {
    const id = generateRandIds();

    const attribute: ProductAttributeDocument = {
      id,
      ...data,
    };
    return this.productAttributeService.create(request.requestId, attribute);
  }

  @Post('create-many')
  createAttributes(
    @Req() request: { requestId: string },
    @Body() data: Omit<ProductAttributeDocument, 'id'>[],
  ) {
    const attributes: ProductAttributeDocument[] = [];

    data.forEach((item) => {
      const id = generateRandIds();
      attributes.push({
        id,
        ...item,
      });
    });

    return this.productAttributeService.create(request.requestId, attributes);
  }

  @Get('fetch-all')
  fetchAllAttributes() {
    return this.productAttributeService.findAll();
  }

  @Get('fetch-one/:id')
  fetchAttribute(@Param('id') id: string) {
    return this.productAttributeService.findOne(id);
  }

  @Patch('update/:id')
  updateAttribute(
    @Param('id') id: string,
    @Body() updateData: Partial<ProductAttributeDocument>,
  ) {
    return this.productAttributeService.update(id, updateData);
  }

  @Delete('delete/:id')
  deleteAttribute(@Param('id') id: string) {
    return this.productAttributeService.delete(id);
  }
}
