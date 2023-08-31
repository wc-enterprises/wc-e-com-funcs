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
import { ProductCategoryService } from '../logics/product-category.service';
import { generateRandIds } from 'src/utils/generateRandIds';

import {
  StandardResponse,
  createErrorResponse,
  createSuccessResponse,
} from 'src/utils/std-response';
import { ProductCategoryDocument } from '../../../firestore/documents/firebase.document';
import { CustomLoggerService } from 'src/logger/custom-logger.service';

@Controller()
export class ProductCategoryController {
  private logger: CustomLoggerService;
  constructor(private readonly productCategoryService: ProductCategoryService) {
    this.logger = new CustomLoggerService('PRODUCT_CATEGORY_CONTROLLER');
  }

  @Post('create-category')
  createCategory(@Body() data: Omit<ProductCategoryDocument, 'id'>) {
    const id = generateRandIds();

    const category: ProductCategoryDocument = {
      id,
      ...data,
    };
    return this.productCategoryService.createCategory(category);
  }

  @Post('create-categories')
  createCategories(@Body() data: Omit<ProductCategoryDocument, 'id'>[]) {
    const categories: ProductCategoryDocument[] = [];

    data.forEach((item) => {
      const id = generateRandIds();
      categories.push({
        id,
        ...item,
      });
    });

    return this.productCategoryService.createCategory(categories);
  }

  @Get('fetch-one-category/:id')
  fetchOneCategory(@Param('id') id: string) {
    return this.productCategoryService.findOneCategory(id);
  }

  @Get('fetch-all-categories')
  async fetchAllCategories(
    @Req() request: { requestId: string },
  ): Promise<StandardResponse<ProductCategoryDocument[]>> {
    try {
      this.logger.log(
        request.requestId,
        `Received request to fetch all categories.`,
      );
      const categories = await this.productCategoryService.findAll(
        request.requestId,
      );
      this.logger.log(
        request.requestId,
        `Fetched all categories successfully.`,
      );
      return createSuccessResponse(
        'Product categories fetched successfully',
        categories,
      );
    } catch (err) {
      this.logger.error(
        request.requestId,
        `Errored while fetching all categories with error: ${JSON.stringify(
          err,
        )}`,
      );
      return createErrorResponse(err.errorCode);
    }
  }

  @Patch('update-category/:id')
  updateCategory(
    @Param('id') id: string,
    @Body() updateData: Partial<ProductCategoryDocument>,
  ) {
    console.log('id', id);
    console.log('updateData', updateData);
    return this.productCategoryService.updateCategory(id, updateData);
  }

  @Delete('delete-category/:id')
  deleteCategory(@Param('id') id: string) {
    return this.productCategoryService.deleteCategory(id);
  }
}
