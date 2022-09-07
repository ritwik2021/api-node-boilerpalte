import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get('EMAIL_HOST'),
            port: configService.get('EMAIL_PORT'),
            auth: {
              user: configService.get('EMAIL_USERNAME'),
              pass: configService.get('EMAIL_PASSWORD')
            }
          },
          defaults: {
            from: "'no-reply' <info@your-org.io>"
          },
          template: {
            dir: join(__dirname, '../../../assets', 'templates'),
            adapter: new HandlebarsAdapter(), // NOTE: change to your preferable adapter
            options: {
              strict: true
            }
          }
        };
      }
    })
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
