import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService, private readonly configService: ConfigService) {}

  async sendMail(mailData: any, subject: string): Promise<void> {
    try {
      let template;
      let context = {};
      if (mailData.otp) {
        template = mailData.template;
        context['subject'] = subject;
        context['header'] = mailData.message;
        context['otp'] = mailData.otp;
      } else {
        template = './conformation';
        context['subject'] = subject;
        context['header'] = mailData.message;
        context['url'] = mailData.url;
      }
      // send mail
      await this.mailService.sendMail({
        from: this.configService.get('MAIL_FROM_ACCOUNT'),
        to: mailData.email,
        subject,
        template,
        context
      });
    } catch (error) {
      Logger.error(error.mesage, 'Error.sendMail');
    }
  }
}
