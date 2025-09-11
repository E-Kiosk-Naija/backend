import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductCategoryRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the product category',
    example: 'Snacks & Beverages',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Description of the product category',
    example: 'All kinds of snacks and beverages',
  })
  description: string;
}
