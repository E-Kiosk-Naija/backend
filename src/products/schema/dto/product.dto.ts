import { ApiProperty } from '@nestjs/swagger';
import { ProductCategoryDto } from 'src/product-categories/schema/dto/product-catrgory.dto';

export class ProductDto {
  @ApiProperty({
    description: 'Prooduct Name',
    example: 'Fanta',
  })
  name: string;

  @ApiProperty({
    description: 'Product Category',
    example: {
      id: '64b7f9c2e1f2c3a4b5d6e7f8',
      name: 'Snacks',
      slug: 'snacks',
      description: 'All kinds of snacks',
    },
  })
  category: ProductCategoryDto;

  @ApiProperty({
    description: 'Product Description',
    example: 'A product from the Cocacola company',
  })
  description: string;

  @ApiProperty({
    description: 'Product Details',
    example: 'Canned 75cl Apple flavour',
  })
  details: string;

  @ApiProperty({
    description: 'Product Image',
    example: 'https://res.cloudinary.com/product/image/upload/sample.jpg',
  })
  image: string;

  constructor(partial: Partial<ProductDto>) {
    Object.entries(partial).forEach(([key, value]) => {
      if (value !== null && value !== undefined && key in this) {
        this[key] = value;
      }
    });
  }
}
