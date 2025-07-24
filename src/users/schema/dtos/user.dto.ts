import { AccountStatus } from 'src/auth/common/enums/account-status.enum';
import { SignupMethod } from '../enums/signup-method.enum';

export class UserDto {
  id: string;
  email: string;
  fullName: string;
  avatar: string;
  googleId?: string | null;
  signupMethod: SignupMethod;
  status: AccountStatus;
  lastLogin?: Date | null;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
