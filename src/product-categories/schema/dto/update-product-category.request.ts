import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProductCategoryRequest {
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
