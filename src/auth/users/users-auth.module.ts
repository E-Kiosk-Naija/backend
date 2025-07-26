import { Module } from '@nestjs/common';
import { UsersAuthController } from './users-auth.controller';
import { UsersAuthService } from './users-auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [UsersModule, PassportModule],
  controllers: [UsersAuthController],
  providers: [UsersAuthService, LocalStrategy],
})
export class UsersAuthModule {}
