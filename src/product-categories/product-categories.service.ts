import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateProductCategoryRequest } from './schema/dto/create-product-category.request';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder } from 'mongoose';
import {
  ProductCategory,
  ProductCategoryDocument,
} from './schema/product-categories.schema';
import slugify from 'slugify';
import { ProductCategoryDto } from './schema/dto/product-catrgory.dto';
import { ApiResponse } from 'src/universal/api.response';
import { AdminDocument } from 'src/admins/schema/admins.schema';
import { PagedApiResponse } from 'src/universal/paged-api.response';
import { UpdateProductCategoryRequest } from './schema/dto/update-product-category.request';

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

  async getProductCategories(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
  ): Promise<PagedApiResponse<ProductCategoryDto>> {
    const skip = (page - 1) * limit;
    const sortOptions: { [key: string]: SortOrder } = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };

    const [productCategories, totalItems] = await Promise.all([
      this.productCategoryModel
        .find()
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.productCategoryModel.countDocuments().exec(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    const productCategoriesDtos = productCategories.map((prosuctCategory) =>
      this.toDto(prosuctCategory),
    );
    return PagedApiResponse.success(
      'Success',
      'Product categories fetched successfully',
      productCategoriesDtos,
      totalItems,
      totalPages,
      page,
      limit,
      page >= totalPages,
    );
  }

  async updateOne(
    id: string,
    updateData: FilterQuery<ProductCategory>,
  ): Promise<ProductCategoryDocument | null> {
    return await this.productCategoryModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
  }

  async updateProductCategory(
    admin: AdminDocument,
    id: string,
    updateDataRequest: UpdateProductCategoryRequest,
  ): Promise<ApiResponse<ProductCategoryDto>> {
    const productCategoryExists = await this.findCategory({ _id: id });

    if (!productCategoryExists)
      throw new BadRequestException('Product Category Not Found');

    const updateData: FilterQuery<ProductCategory> = {
      updatedBy: admin._id,
      name: updateDataRequest.name
        ? updateDataRequest.name
        : productCategoryExists.name,
      description: updateDataRequest
        ? updateDataRequest.description
        : productCategoryExists.description,
      slug: updateDataRequest.name
        ? slugify(updateDataRequest.name, {
            lower: true, // Convert to lowercase
            strict: true, // Strip special characters
            trim: true, // Trim spaces from start and end
          })
        : productCategoryExists.slug,
    };

    const updatedProductCategory = await this.updateOne(id, updateData);

    if (!updatedProductCategory)
      throw new BadRequestException('Failed to Update Product Category');

    return ApiResponse.success(
      HttpStatus.OK,
      'Product Category Updated Successfully',
      this.toDto(updatedProductCategory),
    );
  }

  toDto(category: ProductCategoryDocument): ProductCategoryDto {
    return new ProductCategoryDto({
      id: category._id.toString(),
      ...category.toObject(),
    });
  }
}
