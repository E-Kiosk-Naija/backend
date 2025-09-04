import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotImplementedException,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { time } from 'console';
import { FundWalletDto } from './wallet/schema/dto/fund-wallet.request';
import { ApiResponse } from './universal/api.response';

@Controller()
@ApiTags('Health Check')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return {
      success: true,
      status: HttpStatus.OK,
      message: 'e-Kiosk Naija API is running smoothly!',
      time: new Date().toISOString(),
    };
  }

  @Post('fund/wallet/webhook')
  @HttpCode(HttpStatus.OK)
  async fundWalletWebhook(
    @Body() fundDto: FundWalletDto,
  ): Promise<ApiResponse<string>> {
    throw new NotImplementedException(
      'Fund wallet webhook feature not implemented yet',
    );
  }
}
