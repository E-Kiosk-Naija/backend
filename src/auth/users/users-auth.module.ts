import { Module } from '@nestjs/common';
import { UsersAuthController } from './users-auth.controller';
import { UsersAuthService } from './users-auth.service';

@Module({
  controllers: [UsersAuthController],
  providers: [UsersAuthService],
})
export class UsersAuthModule {}
