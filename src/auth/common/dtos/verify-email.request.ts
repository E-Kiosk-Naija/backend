import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailRequest {
  @ApiProperty({
    description: 'Email address of the user to verify',
    example: 'yunus@ekiosknaija.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: "Verification code (OTP) sent to the user's email",
    example: '123456',
    type: String,
  })
  @IsNotEmpty({ message: 'Verification code is required' })
  @IsString({ message: 'Verification code must be a string' })
  verificationCode: string;
}
