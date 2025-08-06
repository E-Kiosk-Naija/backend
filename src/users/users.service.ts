import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/users.schema';
import { FilterQuery, Model } from 'mongoose';
import { UserDto } from './schema/dtos/user.dto';
import { ApiResponse } from 'src/universal/api.response';
import { LoginResponse } from 'src/auth/users/dtos/login.response';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async validateEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email });
  }

  async createUser(userData: Partial<User>): Promise<UserDto> {
    const newUser = await new this.userModel(userData).save();
    return this.toDto(newUser);
  }

  async findUser(
    query: FilterQuery<UserDocument>,
  ): Promise<UserDocument | null> {
    return await this.userModel.findOne(query);
  }

  async getUser(query: FilterQuery<UserDto>): Promise<UserDto | null> {
    const user = await this.userModel.findOne(query);
    return user ? this.toDto(user) : null;
  }

  async updateUser(
    userId: string,
    updateData: Partial<User>,
  ): Promise<UserDto> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true },
    );
    if (updatedUser) return this.toDto(updatedUser);

    throw new BadRequestException('User Not Found');
  }

  public async generateLoginResponse(
    user: UserDto | any,
    message: string,
  ): Promise<ApiResponse<LoginResponse>> {
    const tokenPayload = {
      sub: user.id,
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

    user = await this.userModel.findByIdAndUpdate(user.id, {
      ...user,
      lastLogin: new Date(),
      refreshToken,
    });

    const loginResponse: LoginResponse = new LoginResponse(
      accessToken,
      refreshToken,
      this.toDto(user),
    );

    return ApiResponse.success<LoginResponse>(
      HttpStatus.OK,
      message,
      loginResponse,
    );
  }

  async getMyProfile(user: User): Promise<ApiResponse<UserDto>> {
    const userDto = await this.getUser({ email: user.email });

    if (!userDto) throw new BadRequestException('User Not Found');

    return ApiResponse.success(
      HttpStatus.OK,
      'Profile fetch successfully',
      userDto,
    );
  }

  async updateAvatar(
    user: User,
    file: Express.Multer.File,
  ): Promise<ApiResponse<UserDto>> {
    const account = await this.findUser({ email: user.email });

    if (!account) throw new BadRequestException('User Not Found');

    if (account.cloudinaryAvatarId)
      await this.cloudinaryService.deleteFile(account.cloudinaryAvatarId);

    const uploadResult = await this.cloudinaryService.uploadFile(
      file,
      'avatar',
    );

    const updatedUser = await this.updateUser(account.id.toString(), {
      avatar: uploadResult.secure_url,
      cloudinaryAvatarId: uploadResult.public_id,
    });

    return ApiResponse.success(
      HttpStatus.OK,
      'Avatar Updated Successsfully',
      updatedUser,
    );
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

  public toDto(user: UserDocument): UserDto {
    const plain = user.toObject();
    return new UserDto({
      id: user._id.toString(),
      email: plain.email,
      fullName: plain.fullName,
      avatar: plain.avatar,
      googleId: plain.googleId,
      signupMethod: plain.signupMethod,
      status: plain.status,
      lastLogin: plain.lastLogin,
    });
  }
}
