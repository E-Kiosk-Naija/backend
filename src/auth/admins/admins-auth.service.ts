import { Injectable, Logger } from '@nestjs/common';
import { AdminsService } from 'src/admins/admins.service';
import { AdminLoginRequest } from './dtos/admin-login.request';
import { ConfigService } from '@nestjs/config';
import { AdminDocument } from 'src/admins/schema/admins.schema';
import { ApiResponse } from 'src/universal/api.response';
import { AdminLoginResponse } from './dtos/admin-login.response';
import { AdminChangePasswordRequest } from './dtos/admin-change-password.request';
import { AdminDto } from 'src/admins/schema/dto/admin.dto';

@Injectable()
export class AdminsAuthService {
  private readonly logger = new Logger(AdminsAuthService.name);

  constructor(
    private readonly adminsService: AdminsService,
    private readonly configService: ConfigService,
  ) {}

  async login(admin: AdminDocument): Promise<ApiResponse<AdminLoginResponse>> {
    return await this.adminsService.generateLoginResponse(
      admin,
      'Login successful',
    );
  }

  async refreshToken(
    admin: AdminDocument,
    refreshToken: string,
  ): Promise<ApiResponse<AdminLoginResponse>> {
    return await this.adminsService.refreshToken(admin, refreshToken);
  }
}
