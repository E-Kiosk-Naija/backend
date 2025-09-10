import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminsService } from 'src/admins/admins.service';
import { AdminDocument } from 'src/admins/schema/admins.schema';
import { AccountStatus } from 'src/auth/common/enums/account-status.enum';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(
    private readonly adminService: AdminsService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }

  async validate(payload: any): Promise<AdminDocument> {
    // Logger.log('JWT Payload:', payload);

    if (!payload || !payload.sub) {
      throw new BadRequestException('Invalid JWT payload');
    }

    if (payload.type !== 'access') {
      throw new BadRequestException('Invalid credentials');
    }

    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      throw new BadRequestException('Token has expired');
    }

    const admin = await this.adminService.findAdmin({
      _id: payload.sub,
      status: AccountStatus.VERIFIED,
      // $or: [{ email: email }, { username: email }],
    });

    if (!admin) {
      throw new BadRequestException('Invalid credentials');
    }

    // Return the admin object - Passport will automatically attach it to req.admin
    // because of the property: 'admin' configuration in PassportModule
    return admin;
  }
}
