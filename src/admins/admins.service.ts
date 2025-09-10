import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './schema/admins.schema';
import { FilterQuery, Model, SortOrder } from 'mongoose';
import { CreateAdminDto } from './schema/dto/create-admin.request';
import { ApiResponse } from 'src/universal/api.response';
import { AdminDto } from './schema/dto/admin.dto';
import { AdminRole } from './schema/enums/admin-roles.enum';
import { compare, hash } from 'bcrypt';
import { UserLoginResponse } from 'src/auth/users/dtos/user-login.response';
import { AdminLoginResponse } from 'src/auth/admins/dtos/admin-login.response';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AdminChangePasswordRequest } from 'src/auth/admins/dtos/admin-change-password.request';
import { PagedApiResponse } from 'src/universal/paged-api.response';

@Injectable()
export class AdminsService {
  private readonly logger = new Logger(AdminsService.name);

  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async getProfile(admin: AdminDocument): Promise<ApiResponse<AdminDto>> {
    return ApiResponse.success(
      HttpStatus.OK,
      'Profile Fetched Successfully',
      this.toDto(admin),
    );
  }

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

    const adminExists = await this.findAdmin({
      $or: [
        { email: createAdminDto.email },
        { username: createAdminDto.username },
      ],
    });
    if (adminExists) {
      throw new BadRequestException(
        `${
          adminExists.email === createAdminDto.email &&
          adminExists.username === createAdminDto.username
            ? 'Email and username already exist'
            : adminExists.email === createAdminDto.email
              ? 'Email already exists'
              : 'Username already exists'
        }`,
      );
    }

    // Generate one time password and set forcePasswordChange to true
    const oneTimePassword = this.generateOneTimePassword();

    this.logger.debug(
      `Generated one-time password for new admin ${createAdminDto.email} :: ${oneTimePassword}`,
    );

    // Send oneTimePassword to the new admin via email

    const createdAdmin = new this.adminModel({
      ...createAdminDto,
      password: await hash(oneTimePassword, 10),
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

  public async generateLoginResponse(
    admin: AdminDocument,
    message: string,
  ): Promise<ApiResponse<AdminLoginResponse>> {
    const tokenPayload = {
      sub: admin.id,
    };

    const accessToken = this.generateAccessToken({
      ...tokenPayload,
      type: 'access',
    });

    // TODO: Hash the refresh token payload
    const refreshToken = this.generateRefreshToken({
      ...tokenPayload,
      type: 'refresh',
    });

    const updatedAdmin = await this.adminModel.findByIdAndUpdate(admin.id, {
      ...admin,
      lastLogin: new Date(),
      refreshToken,
    });

    if (!updatedAdmin) {
      throw new BadRequestException('Admin Not Found');
    }

    const loginResponse: AdminLoginResponse = new AdminLoginResponse(
      accessToken,
      refreshToken,
      this.toDto(updatedAdmin),
    );

    return ApiResponse.success<AdminLoginResponse>(
      HttpStatus.OK,
      message,
      loginResponse,
    );
  }

  async refreshToken(
    admin: AdminDocument,
    refreshToken: string,
  ): Promise<ApiResponse<AdminLoginResponse>> {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    const tokenPayload = {
      sub: admin.id,
      type: 'access',
    };

    const accessToken = this.generateAccessToken(tokenPayload);

    const loginResponse: AdminLoginResponse = new AdminLoginResponse(
      accessToken,
      refreshToken,
      this.toDto(admin),
    );

    return ApiResponse.success<AdminLoginResponse>(
      HttpStatus.OK,
      'Token refreshed successfully',
      loginResponse,
    );
  }

  async changePassword(
    admin: AdminDocument,
    changePasswordRequest: AdminChangePasswordRequest,
  ): Promise<ApiResponse<AdminDto>> {
    const isCurrentPasswordValid = await compare(
      changePasswordRequest.currentPassword,
      admin.password,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const newHashedPassword = await hash(changePasswordRequest.newPassword, 10);

    admin.password = newHashedPassword;
    admin.forcePasswordChange = false;
    const updatedAdmin = await admin.save();

    if (!updatedAdmin) {
      throw new BadRequestException('Failed to change password');
    }

    return ApiResponse.success(
      HttpStatus.OK,
      'Password changed successfully',
      this.toDto(updatedAdmin),
    );
  }

  async deleteAdmin(id: string): Promise<ApiResponse<AdminDto>> {
    const deletedAdmin = await this.adminModel.findByIdAndDelete(id);

    if (!deletedAdmin) {
      throw new BadRequestException('Admin not found');
    }

    return ApiResponse.success(
      HttpStatus.OK,
      'Admin deleted successfully',
      this.toDto(deletedAdmin),
    );
  }

  async getAllAdmins(
    currentAdmin: AdminDocument,
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
  ): Promise<PagedApiResponse<AdminDto>> {
    if (currentAdmin.role !== AdminRole.SUPER_ADMIN) {
      throw new BadRequestException('Only SUPER_ADMIN can view all admins');
    }

    const skip = (page - 1) * limit;
    const sortOptions: { [key: string]: SortOrder } = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };

    const [admins, totalItems] = await Promise.all([
      this.adminModel.find().sort(sortOptions).skip(skip).limit(limit).exec(),
      this.adminModel.countDocuments().exec(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    const adminDtos = admins.map((admin) => this.toDto(admin));
    return PagedApiResponse.success<AdminDto>(
      'Success',
      'Admins fetched successfully',
      adminDtos,
      totalItems,
      totalPages,
      page,
      limit,
      page >= totalPages,
    );
  }

  private generateOneTimePassword(): string {
    return Math.random().toString(36).slice(-8);
  }

  /**
   * Generates a JWT access token using the provided payload.
   *
   * @param tokenPayload - The payload to include in the JWT.
   * @returns The signed JWT access token as a string.
   *
   * @remarks
   * The secret and expiration time for the token are retrieved from the configuration service.
   */
  public generateAccessToken(tokenPayload): string {
    return this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow('JWT_SECRET'),
      expiresIn: this.configService.getOrThrow('JWT_EXPIRES_IN'),
    });
  }

  /**
   * Generates a new JWT refresh token using the provided payload.
   *
   * @param tokenPayload - The payload to include in the refresh token.
   * @returns The signed JWT refresh token as a string.
   *
   * @remarks
   * The secret and expiration time for the refresh token are retrieved from the configuration service
   * using the keys 'JWT_SECRET' and 'JWT_REFRESH_EXPIRES_IN', respectively.
   */
  private generateRefreshToken(tokenPayload): string {
    return this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow('JWT_SECRET'),
      expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN'),
    });
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
