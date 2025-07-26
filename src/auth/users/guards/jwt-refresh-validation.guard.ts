import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class JwtRefreshValidationGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const refreshToken = req.headers['authorization'];

    if (!refreshToken) {
      throw new BadRequestException('Refresh token is missing');
    }

    if (typeof refreshToken !== 'string' || refreshToken.trim() === '') {
      throw new BadRequestException('Invalid refresh token format');
    }
    return true;
  }
}
