import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendOtpRequest {
  @ApiProperty({
    description: 'Email address of the user requesting to resend the OTP',
    example: 'yunus@ekiosknaija.com',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}
