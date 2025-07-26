import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/users.schema';
import { FilterQuery, Model } from 'mongoose';
import { UserDto } from './schema/dtos/user.dto';
import { ApiResponse } from 'src/universal/api.response';
import { LoginResponse } from 'src/auth/users/dtos/login.response';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email });
  }

  async createUser(userData: Partial<User>): Promise<UserDto> {
    const newUser = await new this.userModel(userData).save();
    return this.toDto(newUser);
  }

  async getUser(query: FilterQuery<UserDto>): Promise<User | null> {
    const user = await this.userModel.findOne(query);
    return user ? user : null;
  }

  async updateUser(
    userId: string,
    updateData: Partial<User>,
  ): Promise<UserDto | null> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true },
    );
    return updatedUser ? this.toDto(updatedUser) : null;
  }

  public async generateLoginResponse(
    user: UserDocument | any,
    message: string,
  ): Promise<ApiResponse<LoginResponse>> {
    const tokenPayload = {
      sub: user.id,
    };

    user = await this.userModel.findByIdAndUpdate(user.id, {
      ...user,
      lastLogin: new Date(),
    });

    const loginResponse: LoginResponse = new LoginResponse(
      this.generateAccessToken({
        ...tokenPayload,
        type: 'access',
      }),
      this.generateRefreshToken({
        ...tokenPayload,
        type: 'refresh',
      }),
      this.toDto(user),
    );

    return ApiResponse.success<LoginResponse>(
      HttpStatus.OK,
      message,
      loginResponse,
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
  private generateAccessToken(tokenPayload): string {
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

  private toDto(user: UserDocument): UserDto {
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
