import {
  Controller,
  Get,
  Param,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/users/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from './schema/users.schema';
import { ApiResponse } from 'src/universal/api.response';
import { UserDto } from './schema/dtos/user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from './pipes/file-validation.pipe';

@Controller('users')
@ApiTags('User Controler')
@ApiBearerAuth('accessToken')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get logged in user profile',
    description: 'Get the profile of the user that is making the request',
  })
  @ApiOkResponse({
    description: 'Profile Fetched Successfully',
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
                  example: 'Profile Fetched Successfully',
                },
                data: { $ref: getSchemaPath(UserDto) },
              },
            },
          ],
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'User not found',
    content: {
      'application/json': {
        schema: {
          properties: {
            success: { type: 'boolean', example: false },
            status: { type: 'string', example: 'Error' },
            statusCode: { type: 'number', example: 400 },
            message: { type: 'string', example: 'User not found' },
            error: { type: 'string', example: 'Bad Request' },
          },
        },
      },
    },
  })
  async me(@CurrentUser() user: User): Promise<ApiResponse<UserDto>> {
    return await this.usersService.getMyProfile(user);
  }

  @Put('change-avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
      description: 'Image file for the new Avatar',
    },
  })
  async changeAvatar(
    @CurrentUser() user: User,
    @UploadedFile(new FileValidationPipe(['image/jpeg', 'image/png']))
    file: Express.Multer.File,
  ): Promise<ApiResponse<UserDto>> {
    return await this.usersService.updateAvatar(user, file);
  }
}
