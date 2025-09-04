import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminLocalAuthGuard extends AuthGuard('admin-local') {
  // Override to attach the authenticated admin to request.admin so the
  // CurrentAdmin decorator can return the Admin document.
  // handleRequest(err: any, admin: any, info: any, context: ExecutionContext) {
  //   const req = context.switchToHttp().getRequest();
  //   if (err) throw err;
  //   if (!admin) {
  //     throw new UnauthorizedException(info?.message || 'Unauthorized');
  //   }
  //   req.admin = admin;
  //   return admin;
  // }
}
