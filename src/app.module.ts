import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirestoreModule } from './firestore/firestore.module';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { ProductCategoryController } from './product-catagory/product-cat.controller';
import { ProductCategoryService } from './product-catagory/product-cat.service';
import { ProductPricingController } from './product-pricing/product-pricing.controller';
import { ProductPricingService } from './product-pricing/product-pricing.service';
import { ProductAttributeController } from './product-attribute/product-attribute.controller';
import { ProductAttributeService } from './product-attribute/product-attribute.service';
import { ForFrontendController } from './for-frontends/for-frontends.controller';
import { ForFrontendService } from './for-frontends/for-frontends.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirestoreModule.forRoot({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        keyFilename: configService.get<string>('SA_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    AppController,
    ProductController,
    ProductCategoryController,
    ProductPricingController,
    ProductAttributeController,
    ForFrontendController,
  ],
  providers: [
    AppService,
    ProductService,
    ProductCategoryService,
    ProductPricingService,
    ProductAttributeService,
    ForFrontendService,
  ],
})
export class AppModule {}
