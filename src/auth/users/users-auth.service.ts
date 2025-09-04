import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
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
import { PasswordResetRequest } from './dtos/password-reset.request';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordRequest } from './dtos/reset-password.request';
import { GoogleAuthRequest } from './dtos/google-aut.dto';
import { OAuth2Client } from 'google-auth-library';
import { EmailService } from 'src/email/email.service';
import CONFIRM_EMAIL_TEMPLATE from 'src/email/templates/comfirm-email-otp';
import { WalletService } from 'src/wallet/wallet.service';
import { UserDocument } from 'src/users/schema/users.schema';

@Injectable()
export class UsersAuthService {
  private readonly logger = new Logger(UsersAuthService.name);

  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly walletService: WalletService,
  ) {
    this.googleClient = new OAuth2Client(
      configService.getOrThrow('GOOGLE_CLIENT_ID'),
    );
  }

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
    verificationCodeExpiry.setMinutes(
      verificationCodeExpiry.getMinutes() +
        this.configService.getOrThrow<number>('OTP_EXPIRY_IN_MINS'),
    );

    const newUser = await this.userService.createUser({
      ...emailSignupDto,
      password: await hash(emailSignupDto.password, 10),
      signupMethod: SignupMethod.EMAIL,
      avatar: this.generateAvatar(),
      verificationCode,
      verificationCodeExpiry,
    });

    this.logger.debug(
      `New user registered: ${newUser.email} with verification code: ${otp}`,
    );

    // TODO: Send email

    const htmlBody = CONFIRM_EMAIL_TEMPLATE(emailSignupDto.fullName, otp);

    const emailResponse = await this.emailService.sendEmail(
      newUser.email,
      `Email Verification - ${otp}`,
      htmlBody,
    );

    // this.logger.debug(`Email response ${JSON.stringify(emailResponse)}`);

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
    verificationCodeExpiry.setMinutes(
      verificationCodeExpiry.getMinutes() +
        this.configService.getOrThrow<number>('OTP_EXPIRY_IN_MINS'),
    );

    // user.verificationCode = newVerificationCode;
    // user.verificationCodeExpiry = verificationCodeExpiry;

    await this.userService.updateUser(user._id.toString(), {
      verificationCode: newVerificationCode,
      verificationCodeExpiry,
    });

    // TODO: Implement email sending logic

    this.logger.debug(
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
      lastLogin: new Date(),
    });
    if (!updatedUser) {
      throw new BadRequestException('Failed to update user status');
    }

    this.logger.debug(`User ${user.email} confirmed their email successfully`);

    const wallet = await this.walletService.createWallet(user);

    this.logger.debug(
      `Wallet created for user ${user.email} with reference ${wallet.walletReference}`,
    );

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

  async refreshToken(
    user: UserDto,
    refreshToken: string,
  ): Promise<ApiResponse<LoginResponse>> {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    const tokenPayload = {
      sub: user.id,
      type: 'access',
    };

    const loginResponse: LoginResponse = new LoginResponse(
      this.userService.generateAccessToken(tokenPayload),
      refreshToken,
      user,
    );

    return ApiResponse.success<LoginResponse>(
      HttpStatus.OK,
      'Token refreshed successfully',
      loginResponse,
    );
  }

  async passwordReset(
    resetRequest: PasswordResetRequest,
  ): Promise<ApiResponse<string>> {
    const account = await this.userService.findUser({
      email: resetRequest.email,
    });

    if (!account) throw new BadRequestException('Account not found');

    if (account.signupMethod === SignupMethod.GOOGLE)
      throw new BadRequestException(
        'This account can only be used with google login',
      );

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newVerificationCode = await hash(otp, 10);
    const verificationCodeExpiry = new Date();
    verificationCodeExpiry.setMinutes(
      verificationCodeExpiry.getMinutes() +
        this.configService.getOrThrow<number>('OTP_EXPIRY_IN_MINS'),
    );

    await this.userService.updateUser(account._id.toString(), {
      verificationCode: newVerificationCode,
      verificationCodeExpiry,
      password: null,
    });

    this.logger.debug(
      `Verification code sent to ${resetRequest.email}: ${otp}`,
    );

    return ApiResponse.success<string>(
      HttpStatus.OK,
      `Password Reset, OTP sent to your email ${resetRequest.email}`,
    );
  }

  async resetPassword(
    resetRequest: ResetPasswordRequest,
  ): Promise<ApiResponse<LoginResponse>> {
    const account = await this.userService.findUser({
      email: resetRequest.email,
    });

    if (!account) throw new BadRequestException('Account not found');

    if (account.verificationCode === null)
      throw new BadRequestException('Invalid OTP');

    const isCodeValid = await compare(
      resetRequest.otp,
      account.verificationCode,
    );

    if (!isCodeValid) {
      throw new BadRequestException('Invalid OTP');
    }

    if (
      account.verificationCodeExpiry &&
      account.verificationCodeExpiry < new Date()
    ) {
      throw new BadRequestException('Verification code has expired');
    }

    if (account.signupMethod === SignupMethod.GOOGLE)
      throw new BadRequestException(
        'This account uses google auth, no need for password reset',
      );

    const updatedUser = await this.userService.updateUser(
      account._id.toString(),
      {
        password: await hash(resetRequest.newPassword, 10),
      },
    );

    return await this.userService.generateLoginResponse(
      updatedUser,
      'Password Changed Successfully',
    );
  }

  async handleGoogleLogin(
    googleAuth: GoogleAuthRequest,
  ): Promise<ApiResponse<LoginResponse>> {
    const ticket = await this.googleClient.verifyIdToken({
      idToken: googleAuth.idToken,
      audience: this.configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
    });
    const payload = ticket.getPayload();

    if (!payload) {
      throw new UnauthorizedException('Invalid Google ID Token');
    }

    if (!payload.email) {
      throw new UnauthorizedException('Invalid Google ID Token');
    }

    const existingUser = await this.userService.findUser({
      email: payload.email,
    });

    if (existingUser?.isDeleted)
      throw new BadRequestException('Account Deleted by the User');

    if (existingUser) {
      // User exists, update last login and return login response
      return this.userService.generateLoginResponse(
        existingUser,
        'Google login successful',
      );
    }

    const user = await this.userService.validateGoogleUser({
      googleId: payload.sub,
      email: payload.email,
      fullName: payload.given_name
        ? payload.given_name + ' ' + payload.family_name
        : payload.name,
      avatar: payload.picture,
      status: AccountStatus.VERIFIED,
      lastLogin: new Date(),
      signupMethod: SignupMethod.GOOGLE,
    });

    const wallet = await this.walletService.createWallet(user as UserDocument);

    this.logger.debug(
      `Wallet created for user ${user.email} with reference ${wallet.walletReference}`,
    );

    return this.userService.generateLoginResponse(
      user,
      'Google login successful',
    );
  }

  private generateAvatar(): string {
    const randomNumber = Math.floor(Math.random() * 50) + 1;
    return `https://avatar.iran.liara.run/public/${randomNumber}`;
  }
}
