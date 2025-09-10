import { Module } from '@nestjs/common';
import { UsersAuthController } from './users-auth.controller';
import { UsersAuthService } from './users-auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { UserLocalStrategy } from './strategies/user-local.strategy';
import { UserJwtStrategy } from './strategies/user-jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserJwtRefreshTokenStrategy } from './strategies/user-jwt-refresh.strategy';
import { EmailModule } from 'src/email/email.module';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [UsersModule, PassportModule, JwtModule, EmailModule, WalletModule],
  controllers: [UsersAuthController],
  providers: [
    UsersAuthService,
    UserLocalStrategy,
    UserJwtStrategy,
    UserJwtRefreshTokenStrategy,
  ],
})
export class UsersAuthModule {}
