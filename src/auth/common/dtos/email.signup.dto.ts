import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class EmailSignupDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({
    description: 'Email address of the user',
    example: 'yunus@ekiosknaija.com',
  })
  email: string;

  @IsNotEmpty({ message: 'Full name is required' })
  @IsString({ message: 'Full name must be a string' })
  @ApiProperty({
    description: 'Full name of the user',
    example: 'Yunus Muhammad',
  })
  fullName: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    { message: 'Password must be strong' },
  )
  @ApiProperty({
    description: 'Password for the user account',
    example: 'StrongP@ssw0rd!',
  })
  password: string;
}
