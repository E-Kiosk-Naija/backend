import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { time } from 'console';
import { EmailService } from './email/email.service';

@Controller()
@ApiTags('Health Check')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly emailServcie: EmailService,
  ) {}

  @Get()
  getHello() {
    try {
      const email = this.emailServcie.sendEmail(
        'abudukhanyunus@gmail.com',
        'Email Verification',
        'Hello this is testing maitrap sandbox',
        'Verification',
      );
    } catch (error: any) {
      console.log(error);
    }
    return {
      success: true,
      status: HttpStatus.OK,
      message: 'e-Kiosk Naija API is running smoothly!',
      time: new Date().toISOString(),
    };
  }
}
