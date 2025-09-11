import { Module } from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { ProductCategoriesController } from './product-categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductCategory,
  ProductCategorySchema,
} from './schema/product-categories.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProductCategory.name,
        schema: ProductCategorySchema,
      },
    ]),
  ],
  providers: [ProductCategoriesService],
  controllers: [ProductCategoriesController],
})
export class ProductCategoriesModule {}
