import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirestoreModule } from './firestore/firestore.module';
import { ProductAttributeController } from './core/product/routes/product-attribute.controller';
import { ProductAttributeService } from './core/product/logics/product-attribute.service';
import { ProductCategoryService } from './core/product/logics/product-category.service';
import { ProductPricingService } from './core/product/logics/product-pricing.service';
import { ProductService } from './core/product/logics/product.service';
import { ProductCategoryController } from './core/product/routes/product-category.controller';
import { ProductPricingController } from './core/product/routes/product-pricing.controller';
import { ProductController } from './core/product/routes/product.controller';
import { LoggerModule } from './logger/logger.module';
import { RequestIdMiddleware } from './utils/request-id';
import { ProductModule } from './core/product/product.module';

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
    LoggerModule,
    ProductModule,
  ],
  controllers: [
    AppController,
    ProductController,
    ProductCategoryController,
    ProductPricingController,
    ProductAttributeController,
  ],
  providers: [
    AppService,
    ProductService,
    ProductCategoryService,
    ProductPricingService,
    ProductAttributeService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
