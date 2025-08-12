import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GoogleAuthRequest {
  @IsNotEmpty({ message: 'ID Token is required' })
  @ApiProperty({
    description: 'Google ID Token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: true,
  })
  idToken: string;
}
