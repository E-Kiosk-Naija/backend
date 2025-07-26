import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { UsersAuthService } from './users-auth.service';
import { EmailSignupDto } from '../common/dtos/email.signup.dto';
import { ApiResponse } from 'src/universal/api.response';
import { UserDto } from 'src/users/schema/dtos/user.dto';
import { ResendOtpRequest } from '../common/dtos/resend-otp.request';
import { LoginResponse } from './dtos/login.response';
import { VerifyEmailRequest } from '../common/dtos/verify-email.request';
import { LoginRequest } from './dtos/login.request';
import { LocalAuthGuard } from './guards/local.guard';
import { LoginValidationGuard } from './guards/login.validation.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtRefreshValidationGuard } from './guards/jwt-refresh-validation.guard';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh.guard';

@Controller('auth/users')
@ApiTags('Users Authentication')
export class UsersAuthController {
  constructor(private readonly usersAuthService: UsersAuthService) {}

  @Post('signup')
  @ApiOperation({
    summary: 'User Email Signup',
    description: 'Allows a user to sign up using their email address.',
  })
  @ApiCreatedResponse({
    description: 'User successfully registered',
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
                  example: 'User registered successfully',
                },
                data: {
                  $ref: getSchemaPath(UserDto),
                },
              },
            },
          ],
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    content: {
      'application/json': {
        schema: {
          properties: {
            success: { type: 'boolean', example: false },
            statusCode: { type: 'number', example: 400 },
            message: {
              type: 'string[]',
              example: [
                'Email is required',
                'Invalid email format',
                'Full name must be a string',
                'Full name is required',
                'Password must be strong',
                'Password must be a string',
                'Password is required',
              ],
            },
            error: { type: 'string', example: 'Bad Request' },
          },
        },
      },
    },
  })
  @ApiConflictResponse({
    description: 'User with this email already exists',
    content: {
      'application/json': {
        schema: {
          properties: {
            success: { type: 'boolean', example: false },
            status: { type: 'string', example: 'Error' },
            statusCode: { type: 'number', example: 409 },
            message: {
              type: 'string',
              example: 'User with this email already exists',
            },
          },
        },
      },
    },
  })
  // TODO: Consider users that are already registered but not verified
  async signup(
    @Body() emailSignupDto: EmailSignupDto,
  ): Promise<ApiResponse<UserDto>> {
    return await this.usersAuthService.emailSignup(emailSignupDto);
  }

  // Resend Verification Code
  @Post('resend-verification-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Resend Account Verification Code',
    description: "Resends the verification code to the user's email address.",
  })
  @ApiOkResponse({
    description: 'Verification code resent successfully',
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
                  example: 'Verification code resent successfully',
                },
              },
            },
          ],
        },
      },
    },
  })
  async resendVerificationCode(
    @Body() resendOtpRequest: ResendOtpRequest,
  ): Promise<ApiResponse<string>> {
    return await this.usersAuthService.resendVerificationCode(resendOtpRequest);
  }

  // Confirm Email
  @Post('confirm-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Confirm User Email',
    description: 'Confirms the user email using the verification code (OTP).',
  })
  @ApiOkResponse({
    description: 'Email confirmed successfully',
    content: {
      'application/json': {
        schema: {
          allOf: [
            {
              $ref: getSchemaPath(ApiResponse),
              properties: {
                statusCode: { type: 'number', example: 200 },
                message: {
                  type: 'string',
                  example: 'Email confirmed successfully',
                },
                data: { $ref: getSchemaPath(LoginResponse) },
              },
            },
          ],
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    content: {
      'application/json': {
        schema: {
          properties: {
            success: { type: 'boolean', example: false },
            status: { type: 'string', example: 'Error' },
            statusCode: { type: 'number', example: 400 },
            message: {
              type: 'string',
              example: 'Invalid email address or verification code',
            },
            error: { type: 'string', example: 'Bad Request' },
          },
        },
      },
    },
  })
  async confirmEmail(
    @Body() confirmEmailDto: VerifyEmailRequest,
  ): Promise<ApiResponse<LoginResponse>> {
    return await this.usersAuthService.confirmEmail(confirmEmailDto);
  }

  // Login with Email
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LoginValidationGuard, LocalAuthGuard)
  @ApiOperation({
    summary: 'Login with Email',
    description: 'Logs in a user with their email and password.',
  })
  @ApiOkResponse({
    description: 'User logged in successfully',
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
                  example: 'User logged in successfully',
                },
                data: { $ref: getSchemaPath(LoginResponse) },
              },
            },
          ],
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid email or password',
    content: {
      'application/json': {
        schema: {
          properties: {
            success: { type: 'boolean', example: false },
            status: { type: 'string', example: 'Error' },
            statusCode: { type: 'number', example: 400 },
            message: { type: 'string', example: 'Invalid email or password' },
            error: { type: 'string', example: 'Bad Request' },
          },
        },
      },
    },
  })
  @ApiBody({
    description: 'Login credentials',
    type: LoginRequest,
  })
  async login(
    @CurrentUser() user: UserDto,
  ): Promise<ApiResponse<LoginResponse>> {
    return await this.usersAuthService.login(user);
  }

  // Refresh Token (JWT Refresh Token in Header) - Secure Route
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshValidationGuard, JwtRefreshTokenGuard)
  @ApiOperation({
    summary: 'Refresh User Token',
    description: 'Refreshes the user access token using the refresh token.',
  })
  @ApiOkResponse({
    description: 'Token refreshed successfully',
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
                  example: 'Token refreshed successfully',
                },
                data: { $ref: getSchemaPath(LoginResponse) },
              },
            },
          ],
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid refresh token',
    content: {
      'application/json': {
        schema: {
          properties: {
            success: { type: 'boolean', example: false },
            status: { type: 'string', example: 'Error' },
            statusCode: { type: 'number', example: 400 },
            message: { type: 'string', example: 'Invalid refresh token' },
            error: { type: 'string', example: 'Bad Request' },
          },
        },
      },
    },
  })
  @ApiBearerAuth('accessToken')
  async refreshToken(
    @Req() req: Request,
    @CurrentUser() user: UserDto,
  ): Promise<ApiResponse<LoginResponse>> {
    return await this.usersAuthService.refreshToken(
      user,
      req['refreshToken'] as string,
    );
  }

  // Google OAuth Signup/Login

  // Forgot Password

  // Verify Password Reset Code

  // Reset Password
}
