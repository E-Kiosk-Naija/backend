import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AccountStatus } from 'src/auth/common/enums/account-status.enum';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private readonly userService: UsersService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    try {
      const user = await this.userService.getUser({ email });

      if (
        !user ||
        !user.password ||
        !(await compare(password, user.password))
      ) {
        throw new BadRequestException('Invalid credentials');
      }

      if (user.isDeleted) {
        throw new BadRequestException('User account is deleted');
      }

      if (user.status === AccountStatus.SUSPENDED) {
        throw new BadRequestException('User account is suspended');
      }

      if (user.status === AccountStatus.PENDING) {
        throw new BadRequestException('User account is pending verification');
      }

      return user;
    } catch (error) {
      this.logger.error('Error during local strategy validation', error);
      throw new BadRequestException('Authentication failed');
    }
  }
}
