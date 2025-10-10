import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductCategoryRequest {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Name of the product category',
    example: 'Snacks & Beverages',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Description of the product category',
    example: 'All kinds of snacks and beverages',
  })
  description: string;
}
