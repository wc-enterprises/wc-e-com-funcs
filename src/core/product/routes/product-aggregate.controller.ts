import { Controller, Get, Req } from '@nestjs/common';

import {
  createErrorResponse,
  createSuccessResponse,
} from 'src/utils/std-response';
import { ProductAggregateService } from '../logics/product-aggregate.service';

@Controller()
export class ProductAggregateController {
  constructor(private readonly FS: ProductAggregateService) {}

  @Get('get-categoried-products')
  async getCategorisedProducts(@Req() request: { requestId: string }) {
    try {
      const categorizedProduct = await this.FS.getCategorisedProducts(
        request.requestId,
      );
      return createSuccessResponse(
        'Categorised products fetched successfully',
        categorizedProduct,
      );
    } catch (err) {
      return createErrorResponse(err.errorCode);
    }
  }
}
