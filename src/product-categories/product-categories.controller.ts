import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiSecurity,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AdminJwtAuthGuard } from 'src/auth/admins/guards/admin-jwt.guard';
import { ProductCategoriesService } from './product-categories.service';
import { CreateProductCategoryRequest } from './schema/dto/create-product-category.request';
import { ApiResponse } from 'src/universal/api.response';
import { ProductCategoryDto } from './schema/dto/product-catrgory.dto';
import { CurrentAdmin } from 'src/auth/decorators/current-admin.decorator';
import { AdminDocument } from 'src/admins/schema/admins.schema';
import { PagedApiResponse } from 'src/universal/paged-api.response';
import { UpdateProductCategoryRequest } from './schema/dto/update-peoduct-category.request';

@Controller('product-categories')
@ApiTags('Product Categories')
@ApiBearerAuth('accessToken')
@UseGuards(AdminJwtAuthGuard)
export class ProductCategoriesController {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Create new product category',
    content: {
      'application/json': {
        schema: {
          allOf: [
            { $ref: getSchemaPath(ApiResponse) },
            {
              properties: {
                statusCode: { type: 'number', example: 201 },
                message: {
                  type: 'string',
                  example: 'Product category created successfully',
                },
                data: { $ref: getSchemaPath(ProductCategoryDto) },
              },
            },
          ],
        },
      },
    },
  })
  async createProductCategory(
    @CurrentAdmin() admin: AdminDocument,
    @Body() createProductCategoryRequest: CreateProductCategoryRequest,
  ): Promise<ApiResponse<ProductCategoryDto>> {
    return await this.productCategoriesService.createProductCategory(
      admin,
      createProductCategoryRequest,
    );
  }

  @Get()
  @ApiOkResponse({
    description: 'Fetch a paginated product categories',
    content: {
      'application/json': {
        schema: {
          allOf: [
            { $ref: getSchemaPath(PagedApiResponse) },
            {
              properties: {
                statusCode: { type: 'number', example: 200 },
                message: {
                  type: 'string',
                  example: 'Product categories fetched successfully',
                },
                data: {
                  type: 'array',
                  items: { $ref: getSchemaPath(ProductCategoryDto) },
                },
                totalItems: { type: 'number', example: 50 },
                totalPages: { type: 'number', example: 5 },
                currentPage: { type: 'number', example: 1 },
                itemsPerPage: { type: 'number', example: 10 },
                isLastPage: { type: 'boolean', example: false },
              },
            },
          ],
        },
      },
    },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    schema: {
      type: 'integer',
      default: 1,
    },
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    schema: {
      type: 'integer',
      default: 10,
    },
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Field to sort by',
    schema: {
      type: 'string',
      default: 'createdAt',
    },
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order (asc or desc)',
    schema: {
      type: 'string',
      enum: ['asc', 'desc'],
      default: 'desc',
    },
  })
  async getProductCategories(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
  ): Promise<PagedApiResponse<ProductCategoryDto>> {
    return await this.productCategoriesService.getProductCategories(
      page,
      limit,
      sortBy,
      sortOrder,
    );
  }

  @Put(':id')
  @ApiCreatedResponse({
    description: 'Update product category',
    content: {
      'application/json': {
        schema: {
          allOf: [
            { $ref: getSchemaPath(ApiResponse) },
            {
              properties: {
                statusCode: { type: 'number', example: 200 },
                message: {
                  type: 'string',
                  example: 'Product category created successfully',
                },
                data: { $ref: getSchemaPath(ProductCategoryDto) },
              },
            },
          ],
        },
      },
    },
  })
  async updateProductCategory(
    @CurrentAdmin() admin: AdminDocument,
    @Param('id') id: string,
    @Body() updateData: UpdateProductCategoryRequest,
  ): Promise<ApiResponse<ProductCategoryDto>> {
    return await this.productCategoriesService.updateProductCategory(
      admin,
      id,
      updateData,
    );
  }
}
