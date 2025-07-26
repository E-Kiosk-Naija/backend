import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDto } from 'src/users/schema/dtos/user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly usersService: UsersService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any): Promise<UserDto> {
    if (!payload || !payload.sub) {
      throw new BadRequestException('Invalid JWT payload');
    }

    if (payload.type !== 'refresh') {
      throw new BadRequestException('Invalid credentials');
    }

    // Get the refresh token from the request
    const refreshToken = req.headers['authorization'].split(' ')[1];

    // check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTime) {
      throw new BadRequestException('Session Expired, Please login again');
    }

    const user = await this.usersService.findUser({ _id: payload.sub });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    req['refreshToken'] = refreshToken;
    return this.usersService.toDto(user);
  }
}
