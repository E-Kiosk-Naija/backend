import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminsAuthService } from './admins-auth.service';
import { CurrentAdmin } from '../decorators/current-admin.decorator';
import { AdminDocument } from 'src/admins/schema/admins.schema';
import { AdminLocalAuthGuard } from './guards/admin-local.guard';
import { LoginValidationGuard } from '../common/guards/login.validation.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AdminLoginRequest } from './dtos/admin-login.request';
import { ApiResponse } from 'src/universal/api.response';
import { AdminLoginResponse } from './dtos/admin-login.response';
import { JwtRefreshValidationGuard } from '../common/guards/jwt-refresh-validation.guard';
import { AdminJwtRefreshTokenGuard } from './guards/admin-jwt-refresh.guard';

@Controller('/api/v1/auth/admins')
@ApiTags('Admins Authentication')
export class AdminsAuthController {
  constructor(private readonly adminsAuthService: AdminsAuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LoginValidationGuard, AdminLocalAuthGuard)
  @ApiBody({
    description: 'Login credentials',
    type: AdminLoginRequest,
  })
  @ApiOkResponse({
    description: 'Admin logged in successfully',
    content: {
      'application/json': {
        schema: {
          allOf: [
            { $ref: getSchemaPath(ApiResponse) },
            {
              properties: {
                statusCode: { type: 'number', example: 200 },
                message: {
                  type: 'string',
                  example: 'Admin logged in successfully',
                },
                data: { $ref: getSchemaPath(AdminLoginResponse) },
              },
            },
          ],
        },
      },
    },
  })
  async login(
    @CurrentAdmin() admin: AdminDocument,
  ): Promise<ApiResponse<AdminLoginResponse>> {
    return await this.adminsAuthService.login(admin);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshValidationGuard, AdminJwtRefreshTokenGuard)
  @ApiBearerAuth('accessToken')
  async refreshToken(
    @Req() req: Request,
    @CurrentAdmin() admin: AdminDocument,
  ): Promise<ApiResponse<AdminLoginResponse>> {
    return await this.adminsAuthService.refreshToken(
      admin,
      req['refreshToken'] as string,
    );
  }
}
