import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AccountStatus } from 'src/auth/common/enums/account-status.enum';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';
import { SignupMethod } from 'src/users/schema/enums/signup-method.enum';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private readonly userService: UsersService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.userService.findUser({
      email,
      status: AccountStatus.VERIFIED,
    });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    // Add additional check for Google-only users
    if (!user.password && user.signupMethod === SignupMethod.GOOGLE) {
      throw new BadRequestException('Please use Google login for this account');
    }

    if (user.password === null)
      throw new BadRequestException(
        'You requested to reset you password, please complete that to login',
      );

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    // if (
    //   user.status !== AccountStatus.VERIFIED &&
    //   user.status === AccountStatus.PENDING
    // ) {
    //   throw new BadRequestException('Account is not active');
    // }

    return this.userService.toDto(user); // req.user == this.userService.toDto(user);
  }
}
