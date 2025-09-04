import { Controller } from '@nestjs/common';
import { AdminsAuthService } from './admins-auth.service';

@Controller('auth/admins')
export class AdminsAuthController {
  constructor(private readonly adminsAuthService: AdminsAuthService) {}
}
