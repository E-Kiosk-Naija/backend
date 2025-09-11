import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
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
}
