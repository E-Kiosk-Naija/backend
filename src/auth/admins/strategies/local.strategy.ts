import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AdminsService } from 'src/admins/admins.service';
import { compare } from 'bcrypt';
import { AccountStatus } from 'src/auth/common/enums/account-status.enum';

@Injectable()
export class AdminLocalStrategy extends PassportStrategy(
  Strategy,
  'admin-local',
) {
  private readonly logger = new Logger(AdminLocalStrategy.name);

  constructor(private readonly adminsService: AdminsService) {
    super({ usernameField: 'email' });
  }

  /**
   * Validate admin credentials. If valid, return the raw Admin document so
   * passport will attach it to the request object as `request.admin`.
   */
  async validate(email: string, password: string): Promise<any> {
    // Find only verified admins
    const admin = await this.adminsService.findAdmin({ email });

    if (!admin) {
      throw new BadRequestException('Invalid email or password');
    }

    if (!admin.password) {
      throw new BadRequestException('Account does not have a password set');
    }

    // If admin is required to change password, block login until they update it
    if (admin.forcePasswordChange) {
      throw new BadRequestException(
        'You requested to reset your password, please complete that to login',
      );
    }

    const isPasswordValid = await compare(password, admin.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    // Return the full Admin document. Passport will set req.admin when using
    // the strategy with the name 'admin-local'. The CurrentAdmin decorator reads
    // request.admin so it will receive the Admin document.
    return admin;
  }
}
