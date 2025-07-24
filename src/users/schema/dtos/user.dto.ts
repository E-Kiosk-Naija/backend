import { AccountStatus } from 'src/auth/common/enums/account-status.enum';
import { SignupMethod } from '../enums/signup-method.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: '60c72b2f9b1d8c001c8e4f3a',
  })
  id: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'yunus@ekiosknaija.com',
  })
  email: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'Yunus Muhammad',
  })
  fullName: string;

  @ApiProperty({
    description: 'Avatar URL of the user',
    example: 'https://avatar.iran.liara.run/public/1',
  })
  avatar: string;

  @ApiProperty({
    description: 'Google ID of the user, if using google Authentication',
    example: '1234567890',
    required: false,
  })
  googleId?: string | null;

  @ApiProperty({
    description: 'Method used for signing up the user',
    enum: SignupMethod,
    example: SignupMethod.EMAIL,
  })
  signupMethod: SignupMethod;

  @ApiProperty({
    description: 'Status of the user account',
    enum: AccountStatus,
    example: AccountStatus.PENDING,
  })
  status: AccountStatus;

  @ApiProperty({
    description: 'Last login date and time of the user',
    type: String,
    format: 'date-time',
    example: new Date().toISOString(),
    required: false,
  })
  lastLogin?: Date | null;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
