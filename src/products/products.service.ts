import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schema/products.schema';
import { FilterQuery, Model } from 'mongoose';
import { AdminDocument } from 'src/admins/schema/admins.schema';
import { CreateProductRequest } from './schema/dto/create-product.request';
import { ApiResponse } from 'src/universal/api.response';
import { ProductDto } from './schema/dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<Product>,
  ) {}

  async createProduct(
    admin: AdminDocument,
    createProductRequest: CreateProductRequest,
    image: Express.Multer.File,
  ): Promise<ApiResponse<ProductDto>> {
    throw new NotImplementedException('Not implemented yet');
    // const productExists = await this
  }

  async getProduct(
    filter: FilterQuery<Product>,
  ): Promise<ProductDocument | null> {
    return await this.productModel.findOne(filter);
  }
}
