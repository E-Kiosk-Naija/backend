import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, LibraryResponse, SendEmailV3_1 } from 'node-mailjet';

@Injectable()
export class EmailService {
  private mailjet: Client;

  constructor(private readonly configService: ConfigService) {
    this.mailjet = new Client({
      apiKey: this.configService.getOrThrow('MAILJET_API_KEY'),
      apiSecret: this.configService.getOrThrow('MAILJET_SECRET_KEY'),
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    // text: string,
    htmlBody: string,
  ): Promise<LibraryResponse<SendEmailV3_1.Response>> {
    const body: SendEmailV3_1.Body = {
      Messages: [
        {
          From: { Email: 'no-reply@ekiosknaija.com.ng', Name: 'e-Kiosk Naija' },
          To: [{ Email: to }],
          Subject: subject,
          //   TextPart: text,
          HTMLPart: htmlBody,
        },
      ],
    };

    return await this.mailjet.post('send', { version: 'v3.1' }).request(body);
  }
}
