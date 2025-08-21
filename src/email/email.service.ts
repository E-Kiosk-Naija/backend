import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { MailtrapTransport } from 'mailtrap';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transport: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const token = this.configService.getOrThrow<string>('MAILTRAP_TOKEN');

    this.transport = nodemailer.createTransport(
      MailtrapTransport({
        token,
      }),
    );
  }

  async sendEmail(
    recipientEmail: string,
    subject: string,
    body: string,
    category: string,
  ): Promise<void> {
    recipientEmail = 'ekiosknaija@gmail.com';

    const sender = {
      address: 'noreply@demomailtrap.co',
      name: 'e-Kiosk Naija',
    };

    const mailOptions = {
      from: sender,
      to: [recipientEmail],
      subject,
      html: body,
      category,
    };

    try {
      const response = await this.transport.sendMail(mailOptions);
      this.logger.debug(`Email response: ${JSON.stringify(response)}`);
    } catch (error) {
      this.logger.error('Error sending email', error);
      throw error;
    }
  }
}
