import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductCategoryRequest } from './schema/dto/create-product-category.request';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  ProductCategory,
  ProductCategoryDocument,
} from './schema/product-categories.schema';
import slugify from 'slugify';
import { ProductCategoryDto } from './schema/dto/product-catrgory.dto';
import { ApiResponse } from 'src/universal/api.response';
import { AdminDocument } from 'src/admins/schema/admins.schema';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectModel(ProductCategory.name)
    private productCategoryModel: Model<ProductCategory>,
  ) {}

  async createProductCategory(
    admin: AdminDocument,
    createProductCategoryRequest: CreateProductCategoryRequest,
  ): Promise<ApiResponse<ProductCategoryDto>> {
    const slug = slugify(createProductCategoryRequest.name, {
      lower: true, // Convert to lowercase
      strict: true, // Strip special characters
      trim: true, // Trim spaces from start and end
    });

    const categoryExists = await this.findCategory({
      $or: [{ slug }, { name: createProductCategoryRequest.name }],
    });

    if (categoryExists) {
      throw new ConflictException('Category already exists');
    }

    const category = new this.productCategoryModel({
      ...createProductCategoryRequest,
      slug,
      createdBy: admin._id,
    });

    const createdCategory: ProductCategoryDocument = await category.save();

    return ApiResponse.success(
      HttpStatus.CREATED,
      'Product category created successfully',
      this.toDto(createdCategory),
    );
  }

  async findCategory(
    filter: FilterQuery<ProductCategory>,
  ): Promise<ProductCategory | null> {
    return await this.productCategoryModel.findOne(filter);
  }

  toDto(category: ProductCategoryDocument): ProductCategoryDto {
    return new ProductCategoryDto({
      id: category._id.toString(),
      ...category.toObject(),
    });
  }
}
