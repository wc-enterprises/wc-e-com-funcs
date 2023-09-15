import { Module } from '@nestjs/common';
import { ProductService } from './logics/product.service';
import { ProductPricingService } from './logics/product-pricing.service';
import { ProductAttributeService } from './logics/product-attribute.service';
import { ProductCategoryService } from './logics/product-category.service';
import { ProductController } from './routes/product.controller';
import { ProductPricingController } from './routes/product-pricing.controller';
import { ProductAttributeController } from './routes/product-attribute.controller';
import { ProductCategoryController } from './routes/product-category.controller';
import { LoggerModule } from 'src/logger/logger.module';
import { ProductAggregateService } from './logics/product-aggregate.service';
import { ProductVariantService } from './logics/variant.service';
import { ProductAggregateController } from './routes/product-aggregate.controller';

@Module({
  imports: [LoggerModule],
  controllers: [
    ProductController,
    ProductPricingController,
    ProductAttributeController,
    ProductCategoryController,
    ProductAggregateController,
    ProductAttributeController,
  ],
  providers: [
    ProductService,
    ProductPricingService,
    ProductAttributeService,
    ProductCategoryService,
    ProductAggregateService,
    ProductVariantService,
  ],
  exports: [
    ProductService,
    ProductPricingService,
    ProductAttributeService,
    ProductCategoryService,
    ProductAggregateService,
  ],
})
export class ProductModule {}
