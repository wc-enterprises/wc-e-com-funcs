import { Controller, Get } from '@nestjs/common';
import { ForFrontendService } from './for-frontends.service';
import {
  createErrorResponse,
  createSuccessResponse,
} from 'src/utils/success-func';

@Controller()
export class ForFrontendController {
  constructor(private readonly FS: ForFrontendService) {}

  @Get('get-categoried-products')
  async getCategorisedProducts() {
    try {
      const categorizedProduct = await this.FS.getCategorisedProducts();
      return createSuccessResponse(
        'Categorised products fetched successfully',
        categorizedProduct,
      );
    } catch (err) {
      return createErrorResponse(
        `Errored while fetching categorised products: ${err.message}`,
      );
    }
  }
}
