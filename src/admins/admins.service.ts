import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './schema/admins.schema';
import { FilterQuery, Model } from 'mongoose';
import { CreateAdminDto } from './schema/dto/create-admin.request';
import { ApiResponse } from 'src/universal/api.response';
import { AdminDto } from './schema/dto/admin.dto';
import { AdminRole } from './schema/enums/admin-roles.enum';
import { hash } from 'bcrypt';

@Injectable()
export class AdminsService {
  constructor(@InjectModel(Admin.name) private adminModel: Model<Admin>) {}

  async createAdmin(
    createAdminDto: CreateAdminDto,
    currentAdmin: AdminDocument,
  ): Promise<ApiResponse<AdminDto>> {
    if (currentAdmin.role !== AdminRole.SUPER_ADMIN) {
      throw new BadRequestException('Only SUPER_ADMIN can create new admins');
    }

    if (createAdminDto.role === AdminRole.SUPER_ADMIN) {
      throw new BadRequestException('Cannot create another SUPER_ADMIN');
    }

    // Generate one time password and set forcePasswordChange to true
    const oneTimePassword = this.generateOneTimePassword();

    // Send oneTimePassword to the new admin via email

    const createdAdmin = new this.adminModel({
      ...createAdminDto,
      password: hash(oneTimePassword, 10),
      forcePasswordChange: true,
      createdBy: currentAdmin._id,
    });

    const savedAdmin: AdminDocument = await createdAdmin.save();
    return ApiResponse.success(
      HttpStatus.CREATED,
      'Admin created successfully',
      this.toDto(savedAdmin),
    );
  }

  // Lookup helper used by authentication strategies and other modules
  async findAdmin(filter: FilterQuery<Admin>): Promise<AdminDocument | null> {
    return await this.adminModel.findOne(filter).exec();
  }

  /**
   * Create the initial SUPER_ADMIN if one does not already exist.
   * This bypasses the normal createAdmin checks and should only be used on bootstrap.
   */
  async createSuperAdminIfMissing(
    payload: Partial<Admin>,
  ): Promise<AdminDocument> {
    const existing = await this.findAdmin({ email: payload.email });
    if (existing) return existing as AdminDocument;

    const created: AdminDocument = new this.adminModel({
      ...payload,
      role: AdminRole.SUPER_ADMIN,
    });

    return await created.save();
  }

  private generateOneTimePassword(): string {
    return Math.random().toString(36).slice(-8);
  }

  private toDto(admin: AdminDocument): AdminDto {
    return new AdminDto({
      id: admin._id.toString(),
      fullName: admin.fullName,
      username: admin.username,
      role: admin.role,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    });
  }
}
