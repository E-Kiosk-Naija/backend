import { ApiProperty } from '@nestjs/swagger';
import { AdminRole } from '../enums/admin-roles.enum';

export class AdminDto {
  @ApiProperty({
    description: 'Unique identifier of the admin',
    example: '64b7f8e2f1d3c2a5b6e7f8g9',
  })
  id: string;

  @ApiProperty({
    description: 'Email of the admin',
    example: 'yunus@ekiosknaija.com.ng',
  })
  email: string;

  @ApiProperty({
    description: 'Full name of the admin',
    example: 'Yunus Muhammad',
  })
  fullName: string;

  @ApiProperty({
    description: 'Username of the admin',
    example: 'yunus',
  })
  username: string;

  @ApiProperty({
    description: 'Role of the admin',
    example: AdminRole.SUPER_ADMIN,
  })
  role: AdminRole;

  @ApiProperty({
    description: 'Creation date of the admin',
    example: '2023-08-30T12:34:56Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date of the admin',
    example: '2023-08-30T12:34:56Z',
  })
  updatedAt: Date;

  constructor(partial: Partial<AdminDto>) {
    Object.entries(partial).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key in this) {
        this[key] = value;
      }
    });
  }
}
