import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshTokenGuard extends AuthGuard('jwt-refresh') {
  // This guard can be extended with additional logic if needed
  // For example, you can override the handleRequest method to customize the behavior
  // when a user is authenticated or not.
}
