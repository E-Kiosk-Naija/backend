import { ApiProperty } from '@nestjs/swagger';
import { AdminDto } from 'src/admins/schema/dto/admin.dto';

export class AdminLoginResponse {
  @ApiProperty({
    description: 'Access token for authenticated admin',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token for authenticated admin',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Admin information',
    type: AdminDto,
    required: true,
  })
  admin: AdminDto;

  constructor(accessToken: string, refreshToken: string, admin: AdminDto) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.admin = admin;
  }
}
