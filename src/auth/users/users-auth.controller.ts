import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersAuthService } from './users-auth.service';
import { EmailSignupDto } from '../common/dtos/email.signup.dto';
import { ApiResponse } from 'src/universal/api.response';
import { UserDto } from 'src/users/schema/dtos/user.dto';

@Controller('auth/users')
@ApiTags('Users Authentication')
export class UsersAuthController {
  constructor(private readonly usersAuthService: UsersAuthService) {}

  @Post('signup')
  async signup(
    @Body() emailSignupDto: EmailSignupDto,
  ): Promise<ApiResponse<UserDto>> {
    return await this.usersAuthService.emailSignup(emailSignupDto);
  }
}
