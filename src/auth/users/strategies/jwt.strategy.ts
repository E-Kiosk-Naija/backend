import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDto } from 'src/users/schema/dtos/user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly usersService: UsersService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }

  async validate(payload: any): Promise<UserDto> {
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

    const user = await this.usersService.findUser({ _id: payload.sub });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    return this.usersService.toDto(user);
  }
}
