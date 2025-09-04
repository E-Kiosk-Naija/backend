import { Module } from '@nestjs/common';
import { AdminsAuthService } from './admins-auth.service';
import { AdminsAuthController } from './admins-auth.controller';
import { AdminsModule } from 'src/admins/admins.module';
import { Admin, AdminSchema } from 'src/admins/schema/admins.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    AdminsModule,
  ],
  providers: [AdminsAuthService],
  controllers: [AdminsAuthController],
  exports: [AdminsAuthService],
})
export class AdminsAuthModule {}
