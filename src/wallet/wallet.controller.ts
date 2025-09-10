import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotImplementedException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User, UserDocument } from 'src/users/schema/users.schema';
import { ApiResponse } from 'src/universal/api.response';
import { WalletDto } from './schema/dto/wallet.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { UserJwtAuthGuard } from 'src/auth/users/guards/user-jwt-auth.guard';
import { FundWalletDto } from './schema/dto/fund-wallet.request';

@Controller('/api/v1/wallets')
@ApiBearerAuth('accessToken')
@UseGuards(UserJwtAuthGuard)
@ApiTags('Wallets')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Create a wallet for a logged in user if not exists',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(ApiResponse<WalletDto>),
          properties: {
            statusCode: { type: 'number', example: 201 },
            message: { type: 'string', example: 'Wallet created successfully' },
            data: {
              $ref: getSchemaPath(WalletDto),
            },
          },
        },
      },
    },
  })
  async createWallet(
    @CurrentUser() user: UserDocument,
  ): Promise<ApiResponse<WalletDto>> {
    return await this.walletService.createWalletForUser(user);
  }

  @Get()
  @ApiOkResponse({
    description: 'Get the wallet of the logged in user',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(ApiResponse<WalletDto>),
          properties: {
            statusCode: { type: 'number', example: 200 },
            message: {
              type: 'string',
              example: 'Wallet retrieved successfully',
            },
            data: {
              $ref: getSchemaPath(WalletDto),
            },
          },
        },
      },
    },
  })
  async getWallet(@CurrentUser() user: User): Promise<ApiResponse<WalletDto>> {
    return await this.walletService.getUserWallet(user);
  }

  @Post('fund')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    description: 'Fund the wallet of the logged in user',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(ApiResponse<string>),
          properties: {
            statusCode: { type: 'number', example: 201 },
            message: { type: 'string', example: 'Wallet funded successfully' },
            data: { type: 'string', example: 'Transaction ID' },
          },
        },
      },
    },
  })
  async fundWallet(
    @CurrentUser() user: User,
    @Body() fundDto: FundWalletDto,
  ): Promise<ApiResponse<string>> {
    throw new NotImplementedException(
      'Fund wallet feature not implemented yet',
    );
    // return await this.walletService.fundWallet(user, fundDto);
  }
}
