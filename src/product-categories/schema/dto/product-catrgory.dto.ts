import { ApiProperty } from '@nestjs/swagger';

export class ProductCategoryDto {
  @ApiProperty({
    description: 'Unique identifier of the product category',
    example: '64b7f9c2e1f2c3a4b5d6e7f8',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the product category',
    example: 'Snacks & Beverages',
  })
  name: string;

  @ApiProperty({
    description: 'Slug of the product category',
    example: 'snacks-beverages',
  })
  slug: string;

  @ApiProperty({
    description: 'Description of the product category',
    example: 'All kinds of snacks and beverages',
  })
  description: string;

  constructor(partial: Partial<ProductCategoryDto>) {
    Object.entries(partial).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key in this) {
        this[key] = value;
      }
    });
  }
}
