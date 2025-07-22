import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersAuthService } from './users-auth.service';

@Controller('auth/users')
@ApiTags('Users Authentication')
export class UsersAuthController {
  constructor(private readonly usersAuthService: UsersAuthService) {}
}
