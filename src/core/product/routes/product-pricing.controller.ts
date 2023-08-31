import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductPricingService } from '../logics/product-pricing.service';
import { generateRandIds } from 'src/utils/generateRandIds';
import { ProductPricingDocument } from '../../../firestore/documents/firebase.document';

@Controller()
export class ProductPricingController {
  constructor(private readonly productPricingService: ProductPricingService) {}

  @Post('create-pricing')
  createPricing(@Body() data: Omit<ProductPricingDocument, 'id'>) {
    const id = generateRandIds();

    const pricing: ProductPricingDocument = {
      id,
      ...data,
    };
    return this.productPricingService.createPricing(pricing);
  }

  @Post('create-pricings')
  createPricings(@Body() data: Omit<ProductPricingDocument, 'id'>[]) {
    const pricings: ProductPricingDocument[] = [];

    data.forEach((item) => {
      const id = generateRandIds();
      pricings.push({
        id,
        ...item,
      });
    });

    return this.productPricingService.createPricing(pricings);
  }

  @Get('fetch-all-pricings')
  fetchAllPricings() {
    return this.productPricingService.findAll();
  }

  @Get('fetch-pricing/:id')
  fetchPricing(@Param('id') id: string) {
    return this.productPricingService.findOne(id);
  }

  @Patch('update-pricing/:id')
  updatePricing(
    @Param('id') id: string,
    @Body() updateData: Partial<ProductPricingDocument>,
  ) {
    return this.productPricingService.updatePricing(id, updateData);
  }

  @Delete('delete-pricing/:id')
  deletePricing(@Param('id') id: string) {
    return this.productPricingService.deletePricing(id);
  }
}
