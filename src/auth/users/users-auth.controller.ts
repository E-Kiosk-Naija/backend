import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
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

  // Refresh Token (JWT Refresh Token in Header) - Secure Route

  // Google OAuth Signup/Login

  // Forgot Password

  // Verify Password Reset Code

  // Reset Password
}
