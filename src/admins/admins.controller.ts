import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './schema/dto/create-admin.request';
import { CurrentAdmin } from 'src/auth/decorators/current-admin.decorator';
import { AdminDocument } from './schema/admins.schema';
import { AdminLocalAuthGuard } from 'src/auth/admins/guards/admin-local.guard';
import { ApiResponse } from 'src/universal/api.response';
import { AdminDto } from './schema/dto/admin.dto';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post('create')
  @UseGuards(AdminLocalAuthGuard)
  async createAdmin(
    @Body() createAdminDto: CreateAdminDto,
    @CurrentAdmin() currentAdmin: AdminDocument,
  ): Promise<ApiResponse<AdminDto>> {
    return this.adminsService.createAdmin(createAdminDto, currentAdmin);
  }
}
