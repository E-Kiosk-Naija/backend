import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiResponse } from 'src/universal/api.response';
import { ProductDto } from './schema/dto/product.dto';
import { CreateProductRequest } from './schema/dto/create-product.request';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentAdmin } from 'src/auth/decorators/current-admin.decorator';
import { AdminDocument } from 'src/admins/schema/admins.schema';
import { AdminJwtAuthGuard } from 'src/auth/admins/guards/admin-jwt.guard';

@Controller('/api/v1/products')
@UseGuards(AdminJwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Product name',
        },
        category: {
          type: 'string',
          description: 'Product category',
        },
        description: {
          type: 'string',
          description: 'Product description',
        },
        details: {
          type: 'string',
          description: 'Product description',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['name', 'category', 'image'],
      description: 'Upload the product image',
    },
  })
  async createProduct(
    @CurrentAdmin() admin: AdminDocument,
    @Body() createProductRequest: CreateProductRequest,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<ApiResponse<ProductDto>> {
    return await this.productsService.createProduct(
      admin,
      createProductRequest,
      image,
    );
  }
}
