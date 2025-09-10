import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './schema/dto/create-admin.request';
import { CurrentAdmin } from 'src/auth/decorators/current-admin.decorator';
import { AdminDocument } from './schema/admins.schema';
import { AdminLocalAuthGuard } from 'src/auth/admins/guards/admin-local.guard';
import { ApiResponse } from 'src/universal/api.response';
import { AdminDto } from './schema/dto/admin.dto';
import { AdminChangePasswordRequest } from 'src/auth/admins/dtos/admin-change-password.request';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';
import { AdminJwtAuthGuard } from 'src/auth/admins/guards/admin-jwt.guard';
import { PagedApiResponse } from 'src/universal/paged-api.response';

@Controller('/api/v1/admins')
@ApiBearerAuth('accessToken')
@UseGuards(AdminJwtAuthGuard)
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get('me')
  @ApiOkResponse({
    description: 'Get logged in admin profile',
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
                  example: 'Profile Fetched Successfully',
                },
                data: { $ref: getSchemaPath(AdminDto) },
              },
            },
          ],
        },
      },
    },
  })
  async getMyProfile(
    @CurrentAdmin() admin: AdminDocument,
  ): Promise<ApiResponse<AdminDto>> {
    return await this.adminsService.getProfile(admin);
  }

  @Post('create')
  @ApiCreatedResponse({
    description: 'Admin created successfully',
    content: {
      'application/json': {
        schema: {
          allOf: [
            { $ref: getSchemaPath(ApiResponse) },
            {
              properties: {
                statusCode: { type: 'number', example: 201 },
                message: {
                  type: 'string',
                  example: 'Admin created successfully',
                },
                data: { $ref: getSchemaPath(AdminDto) },
              },
            },
          ],
        },
      },
    },
  })
  async createAdmin(
    @Body() createAdminDto: CreateAdminDto,
    @CurrentAdmin() currentAdmin: AdminDocument,
  ): Promise<ApiResponse<AdminDto>> {
    return this.adminsService.createAdmin(createAdminDto, currentAdmin);
  }

  @Get()
  @ApiOkResponse({
    description: 'Admins fetched successfully',
    content: {
      'application/json': {
        schema: {
          allOf: [
            { $ref: getSchemaPath(PagedApiResponse) },
            {
              properties: {
                statusCode: { type: 'number', example: 200 },
                message: {
                  type: 'string',
                  example: 'Admins fetched successfully',
                },
                data: {
                  type: 'array',
                  items: { $ref: getSchemaPath(AdminDto) },
                },
                totalItems: { type: 'number', example: 50 },
                totalPages: { type: 'number', example: 5 },
                currentPage: { type: 'number', example: 1 },
                itemsPerPage: { type: 'number', example: 10 },
                isLastPage: { type: 'boolean', example: false },
              },
            },
          ],
        },
      },
    },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    schema: {
      type: 'integer',
      default: 1,
    },
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    schema: {
      type: 'integer',
      default: 10,
    },
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Field to sort by',
    schema: {
      type: 'string',
      default: 'createdAt',
    },
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order (asc or desc)',
    schema: {
      type: 'string',
      enum: ['asc', 'desc'],
      default: 'desc',
    },
  })
  async getAllAdmins(
    @CurrentAdmin() admin: AdminDocument,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
  ): Promise<PagedApiResponse<AdminDto>> {
    return await this.adminsService.getAllAdmins(
      admin,
      page,
      limit,
      sortBy,
      sortOrder,
    );
  }

  @Put('change-password')
  @ApiOkResponse({
    description: 'Password changed successfully',
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
                  example: 'Password changed successfully',
                },
                data: { $ref: getSchemaPath(AdminDto) },
              },
            },
          ],
        },
      },
    },
  })
  async changePassword(
    @CurrentAdmin() admin: AdminDocument,
    @Body() changePasswordRequest: AdminChangePasswordRequest,
  ) {
    return await this.adminsService.changePassword(
      admin,
      changePasswordRequest,
    );
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Admin deleted successfully',
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
                  example: 'Admin deleted successfully',
                },
                data: { $ref: getSchemaPath(AdminDto) },
              },
            },
          ],
        },
      },
    },
  })
  async deleteAdmin(@Param('id') id: string): Promise<ApiResponse<AdminDto>> {
    return this.adminsService.deleteAdmin(id);
  }
}
