import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { time } from 'console';

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
}
