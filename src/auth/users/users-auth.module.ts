import { Module } from '@nestjs/common';
import { UsersAuthController } from './users-auth.controller';
import { UsersAuthService } from './users-auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh.strategy';
import { EmailModule } from 'src/email/email.module';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [UsersModule, PassportModule, JwtModule, EmailModule, WalletModule],
  controllers: [UsersAuthController],
  providers: [
    UsersAuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
  ],
})
export class UsersAuthModule {}
