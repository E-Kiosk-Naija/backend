import { Module } from '@nestjs/common';
import { AdminsAuthService } from './admins-auth.service';
import { AdminsAuthController } from './admins-auth.controller';

@Module({
  providers: [AdminsAuthService],
  controllers: [AdminsAuthController],
})
export class AdminsAuthModule {}
