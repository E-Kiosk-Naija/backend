import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/users/schema/dtos/user.dto';

export class UserLoginResponse {
  @ApiProperty({
    description: 'Access token for authenticated user',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token for authenticated user',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'User information',
    type: UserDto,
    required: true,
  })
  user: UserDto;

  constructor(accessToken: string, refreshToken: string, user: UserDto) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.user = user;
  }
}
