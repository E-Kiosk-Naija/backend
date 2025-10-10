import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsMongoId } from 'class-validator';

export class CreateProductRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Product Name',
    example: 'Fanta',
  })
  name: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Product Category (MongoDB ObjectId)',
    example: '64b7f9c2e1f2c3a4b5d6e7f8',
  })
  category: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Product Description',
    example: 'A product from the Coca-Cola company',
    required: false,
  })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Product Details',
    example: 'Canned 75cl Apple flavour',
    required: false,
  })
  details?: string;
}
