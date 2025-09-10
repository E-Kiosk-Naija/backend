import { Module } from '@nestjs/common';
import { AdminsAuthService } from './admins-auth.service';
import { AdminsAuthController } from './admins-auth.controller';
import { AdminsModule } from 'src/admins/admins.module';
import { Admin, AdminSchema } from 'src/admins/schema/admins.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminLocalStrategy } from './strategies/admin-local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AdminJwtStrategy } from './strategies/admin-jwt.strategy';
import { AdminJwtRefreshTokenStrategy } from './strategies/admin-jwt-refresh.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    AdminsModule,
    PassportModule.register({
      property: 'admin',
    }),
  ],
  providers: [
    AdminsAuthService,
    AdminLocalStrategy,
    AdminJwtStrategy,
    AdminJwtRefreshTokenStrategy,
  ],
  controllers: [AdminsAuthController],
  exports: [AdminsAuthService],
})
export class AdminsAuthModule {}
