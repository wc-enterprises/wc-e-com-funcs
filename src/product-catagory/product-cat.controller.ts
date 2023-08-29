import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductCategoryService } from './product-cat.service';
import { generateRandIds } from 'src/utils/generateRandIds';
import { ProductCategoryDocument } from './documents/product-cat.document';
import {
  StandardSuccessResponse,
  createErrorResponse,
  createSuccessResponse,
} from 'src/utils/success-func';

@Controller()
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

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
  async fetchAllCategories(): Promise<
    StandardSuccessResponse<ProductCategoryDocument[]>
  > {
    try {
      const categories = await this.productCategoryService.findAll();
      return createSuccessResponse(
        'Product categories fetched successfully',
        categories,
      );
    } catch (err) {
      return createErrorResponse(
        `Errored while fetching product categories: ${err.message}`,
      );
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
