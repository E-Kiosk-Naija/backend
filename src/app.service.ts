import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { AdminsService } from './admins/admins.service';
import { ConfigService } from '@nestjs/config';
import { AdminRole } from './admins/schema/enums/admin-roles.enum';
import { hash } from 'bcrypt';
import { AdminDto } from './admins/schema/dto/admin.dto';
import { Admin } from './admins/schema/admins.schema';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly adminsService: AdminsService,
    private readonly configService: ConfigService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async onModuleInit() {
    // Create SUPER_ADMIN on startup if it doesn't exist. Credentials come from env.
    const email = this.configService.getOrThrow('SUPER_ADMIN_EMAIL');
    const username = this.configService.getOrThrow('SUPER_ADMIN_USERNAME');
    const password = this.configService.getOrThrow('SUPER_ADMIN_PASSWORD');

    const existing = await this.adminsService.findAdmin({ email });
    if (existing) {
      this.logger.log('SUPER_ADMIN already exists; skipping creation');
      return;
    }

    const hashed = await hash(password, 10);
    const createDto: Partial<Admin> = {
      fullName: 'Super Admin',
      email,
      username,
      password: hashed,
      role: AdminRole.SUPER_ADMIN,
      forcePasswordChange: false,
    };

    await this.adminsService.createSuperAdminIfMissing(createDto);

    this.logger.log('SUPER_ADMIN created');
  }
}
