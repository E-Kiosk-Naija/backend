import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { EmailSignupDto } from '../common/dtos/email.signup.dto';
import { UserDto } from '../../users/schema/dtos/user.dto';
import { ApiResponse } from '../../universal/api.response';
import { UsersService } from 'src/users/users.service';
import { AccountStatus } from '../common/enums/account-status.enum';
import { hash, compare } from 'bcrypt';
import { SignupMethod } from 'src/users/schema/enums/signup-method.enum';
import { ResendOtpRequest } from '../common/dtos/resend-otp.request';
import { VerifyEmailRequest } from '../common/dtos/verify-email.request';
import { LoginResponse } from './dtos/login.response';
import { LoginRequest } from './dtos/login.request';

@Injectable()
export class UsersAuthService {
  private readonly logger = new Logger(UsersAuthService.name);

  constructor(private readonly userService: UsersService) {}

  async emailSignup(
    emailSignupDto: EmailSignupDto,
  ): Promise<ApiResponse<UserDto>> {
    const userExists = await this.userService.validateEmail(
      emailSignupDto.email,
    );

    if (userExists) {
      throw new ConflictException({
        success: false,
        statusCode: HttpStatus.CONFLICT,
        message: 'User with this email already exists',
      });

      //   if (userExists.status === AccountStatus.VERIFIED) {
      //     throw new ConflictException({
      //       success: false,
      //       statusCode: HttpStatus.CONFLICT,
      //       message: 'User with this email already exists',
      //     });
      //   } else if (userExists.status !== AccountStatus.PENDING) {
      //     throw new BadRequestException({
      //       success: false,
      //       statusCode: HttpStatus.BAD_REQUEST,
      //       message: 'You',
      //     });
      //   }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const verificationCode = await hash(otp, 10);
    const verificationCodeExpiry = new Date();
    verificationCodeExpiry.setMinutes(verificationCodeExpiry.getMinutes() + 1);

    const newUser = await this.userService.createUser({
      ...emailSignupDto,
      password: await hash(emailSignupDto.password, 10),
      signupMethod: SignupMethod.EMAIL,
      avatar: this.generateAvatar(),
      verificationCode,
      verificationCodeExpiry,
    });

    this.logger.log(
      `New user registered: ${newUser.email} with verification code: ${otp}`,
    );

    return ApiResponse.success<UserDto>(
      HttpStatus.CREATED,
      'User registered successfully',
      newUser,
    );
  }

  async resendVerificationCode(
    resendOtpRequest: ResendOtpRequest,
  ): Promise<ApiResponse<string>> {
    const user = await this.userService.validateEmail(resendOtpRequest.email);
    if (!user) {
      throw new BadRequestException('Invalid email address');
    }

    if (user.status === AccountStatus.VERIFIED) {
      throw new BadRequestException('User account is already verified');
    }

    if (user.status !== AccountStatus.PENDING) {
      throw new BadRequestException(
        'User account is not in a valid state to resend verification code, contact support',
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newVerificationCode = await hash(otp, 10);
    const verificationCodeExpiry = new Date();
    verificationCodeExpiry.setMinutes(verificationCodeExpiry.getMinutes() + 1);

    user.verificationCode = newVerificationCode;
    user.verificationCodeExpiry = verificationCodeExpiry;

    await this.userService.updateUser(user._id.toString(), {
      verificationCode: newVerificationCode,
      verificationCodeExpiry,
    });

    // TODO: Implement email sending logic

    this.logger.log(
      `Verification code sent to ${resendOtpRequest.email}: ${otp}`,
    );

    return ApiResponse.success<string>(
      HttpStatus.OK,
      `Verification code has been sent to ${resendOtpRequest.email}`,
    );
  }

  async confirmEmail(
    confirmEmailDto: VerifyEmailRequest,
  ): Promise<ApiResponse<LoginResponse>> {
    const user = await this.userService.validateEmail(confirmEmailDto.email);
    if (!user) {
      throw new BadRequestException(
        'Invalid email address or verification code',
      );
    }
    if (user.status === AccountStatus.VERIFIED) {
      throw new BadRequestException('User account is already verified');
    }
    if (!user.verificationCode) {
      throw new BadRequestException('Invalid verification code');
    }
    const isCodeValid = await compare(
      confirmEmailDto.verificationCode,
      user.verificationCode,
    );
    if (!isCodeValid) {
      throw new BadRequestException('Invalid verification code');
    }
    if (
      user.verificationCodeExpiry &&
      user.verificationCodeExpiry < new Date()
    ) {
      throw new BadRequestException('Verification code has expired');
    }

    if (user.status !== AccountStatus.PENDING) {
      throw new BadRequestException(
        'User account is not in a valid state to confirm email, contact support',
      );
    }

    user.status = AccountStatus.VERIFIED;
    user.verificationCode = null;
    user.verificationCodeExpiry = null;

    const updatedUser = await this.userService.updateUser(user.id, {
      status: AccountStatus.VERIFIED,
      verificationCode: null,
      verificationCodeExpiry: null,
    });
    if (!updatedUser) {
      throw new BadRequestException('Failed to update user status');
    }

    this.logger.log(`User ${user.email} confirmed their email successfully`);

    return await this.userService.generateLoginResponse(
      updatedUser,
      'Email confirmed successfully',
    );
  }

  async login(user: UserDto): Promise<ApiResponse<LoginResponse>> {
    // const user = await this.userService.getUser({
    //   email: loginDto.email,
    //   status: AccountStatus.VERIFIED,
    //   isDeleted: false,
    // });
    // if (!user) {
    //   throw new BadRequestException('Invalid email or password');
    // }

    // if (!user.password) {
    //   throw new BadRequestException(
    //     'You can only login with Google using this email',
    //   );
    // }

    // const isPasswordValid = await compare(loginDto.password, user.password);

    // if (!isPasswordValid) {
    //   throw new BadRequestException('Invalid email or password');
    // }

    return await this.userService.generateLoginResponse(
      user,
      'Login successful',
    );
  }

  private generateAvatar(): string {
    const randomNumber = Math.floor(Math.random() * 50) + 1;
    return `https://avatar.iran.liara.run/public/${randomNumber}`;
  }
}
