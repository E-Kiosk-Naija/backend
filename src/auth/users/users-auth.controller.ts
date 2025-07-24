import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { UsersAuthService } from './users-auth.service';
import { EmailSignupDto } from '../common/dtos/email.signup.dto';
import { ApiResponse } from 'src/universal/api.response';
import { UserDto } from 'src/users/schema/dtos/user.dto';

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
  async signup(
    @Body() emailSignupDto: EmailSignupDto,
  ): Promise<ApiResponse<UserDto>> {
    return await this.usersAuthService.emailSignup(emailSignupDto);
  }
}
