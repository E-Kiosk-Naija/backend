import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { EmailSignupDto } from '../common/dtos/email.signup.dto';
import { UserDto } from '../../users/schema/dtos/user.dto';
import { ApiResponse } from '../../universal/api.response';
import { UsersService } from 'src/users/users.service';
import { AccountStatus } from '../common/enums/account-status.enum';
import { hash } from 'bcrypt';
import { SignupMethod } from 'src/users/schema/enums/signup-method.enum';
import { User, UserDocument } from 'src/users/schema/users.schema';

@Injectable()
export class UsersAuthService {
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

    const verificationCode = await hash(
      Math.floor(100000 + Math.random() * 900000).toString(),
      10,
    );
    const verificationCodeExpiry = new Date();
    verificationCodeExpiry.setMinutes(verificationCodeExpiry.getMinutes() + 30);

    const newUser = await this.userService.createUser({
      ...emailSignupDto,
      password: await hash(emailSignupDto.password, 10),
      signupMethod: SignupMethod.EMAIL,
      avatar: this.generateAvatar(),
      verificationCode,
      verificationCodeExpiry,
    });

    return ApiResponse.success<UserDto>(
      HttpStatus.CREATED,
      'User registered successfully',
      newUser,
    );
  }

  private generateAvatar(): string {
    const randomNumber = Math.floor(Math.random() * 50) + 1;
    return `https://avatar.iran.liara.run/public/${randomNumber}`;
  }
}
