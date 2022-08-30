import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import xss from 'xss-clean';
import hpp from 'hpp';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import { ValidationError } from 'class-validator';

import { AppModule } from './app.module';
import { configureSwagger } from './shared/swagger/swagger';
import { telegramBot } from './shared/helper/telegram.bot';
import { HttpExceptionFilter } from 'shared/core/httpexception.filter';

async function main() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const envApp = await app.get(ConfigService).get('NODE_ENV');
  const port = await app.get(ConfigService).get('NODE_PORT');
  const allowedDomains = await app.get(ConfigService).get('ALLOWED_DOMAINS');
  const whitelist = allowedDomains.split(',');
  app.setGlobalPrefix(await app.get(ConfigService).get('GLOBAL_PRIFIX'));

  app.use(cookieParser());
  app.enableCors({
    origin: function (origin, callback) {
      if (envApp != 'dev') {
        if (!origin || whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Access Denied'));
        }
      } else {
        callback(null, true);
      }
    },
    credentials: true
  }); // CORS Settings

  app.use(
    helmet({
      hsts: {
        includeSubDomains: true,
        preload: true,
        maxAge: 63072000
      },
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          defaultSrc: [
            "'self'",
            // "data:",
            // "blob:",
            'https://polyfill.io',
            'https://*.cloudflare.com',
            'http://127.0.0.1:3000/'
            // "ws:",
          ],
          baseUri: ["'self'"],
          scriptSrc: [
            "'self'",
            'http://127.0.0.1:3000/',
            'https://*.cloudflare.com',
            'https://polyfill.io'
            // "http:",
            // "data:",
          ],
          styleSrc: ["'self'", 'https:', 'http:', "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'blob:'],
          fontSrc: ["'self'", 'https:', 'data:'],
          childSrc: ["'self'", 'blob:'],
          styleSrcAttr: ["'self'", "'unsafe-inline'", 'http:'],
          frameSrc: ["'self'"]
        }
      }
    })
  ); //Security purpose to hide unwanted headers
  app.use(compression()); // Compression Settings
  app.use(
    csurf({
      cookie: { httpOnly: true, secure: true },
      ignoreMethods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'DELETE', 'PATCH']
    })
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(xss()); // XSS Filter
  app.use(hpp()); // Prevent http Parameter pollution

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(validationErrors);
      }
    })
  );

  // swagger middleware
  if (['dev', 'staging', 'uat'].includes(envApp)) {
    configureSwagger(app);
  }

  await app.listen(port, () => {
    Logger.log(`${envApp} Server is running on ${port}`, `Application Server`);
  });
}
main();
