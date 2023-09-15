import { Controller, Get, Req } from '@nestjs/common';

import {
  StandardResponse,
  createErrorResponse,
  createSuccessResponse,
} from 'src/utils/std-response';
import { ProductAggregateService } from '../logics/product-aggregate.service';
import { CustomLoggerService } from 'src/logger/custom-logger.service';
import { ICategorizedProductsWithAttributesAndVariants } from 'src/utils/interface';

@Controller()
export class ProductAggregateController {
  private logger: CustomLoggerService = new CustomLoggerService(
    'PRODUCT_AGGREGATE_CONTROLLER',
  );
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

  @Get('get-categorized-products-with-attributes-and-variants')
  async getCategorizedProductsWithAttributesAndVariants(
    @Req() request: { requestId: string },
  ): Promise<
    StandardResponse<ICategorizedProductsWithAttributesAndVariants[]>
  > {
    try {
      const categorizedProducts =
        await this.FS.getCategorisedProductsWithAttributesAndVariants(
          request.requestId,
        );
      return createSuccessResponse(
        `Categorized products fetched successfully`,
        categorizedProducts,
      );
    } catch (err) {
      this.logger.error(
        request.requestId,
        `Errored while getting categorized products with attributes and variants with message ${err.message}`,
      );
      return createErrorResponse(err.errorCode);
    }
  }
}
