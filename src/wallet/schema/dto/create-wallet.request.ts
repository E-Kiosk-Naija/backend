import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateWalletRequest {
  @ApiProperty({
    description: 'The ID of the user for whom the wallet is being created',
    type: String,
    example: '60d5ec49f1c2b14b2c8b4567',
  })
  @IsString({ message: 'User ID must be a string' })
  @IsString({ message: 'User ID is required' })
  userId: string;
}
