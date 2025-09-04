import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AdminRole } from '../enums/admin-roles.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Full name of the admin',
    example: 'Yunus Muhammd',
  })
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email of the admin',
    example: 'yunus@ekiosknaija.com.ng',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Username of the admin',
    example: 'yunus',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Password of the admin',
    example: 'securePassword123',
  })
  password: string;

  @IsNotEmpty()
  @IsEnum(AdminRole)
  @ApiProperty({
    description: 'Role of the admin',
    example: AdminRole.ADMIN,
  })
  role: AdminRole;
}
