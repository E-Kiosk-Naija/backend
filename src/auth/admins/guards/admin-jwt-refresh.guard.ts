import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminJwtRefreshTokenGuard extends AuthGuard('admin-jwt-refresh') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // Manually set the admin property to match the local strategy behavior
    if (user) {
      request.admin = user;
    }

    if (err) {
      throw err;
    }

    if (!user) {
      throw new UnauthorizedException('Authentication failed');
    }

    return user;
  }
}
