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
import { HttpExceptionFilter } from './shared/core/httpexception.filter';
import { csrfExcludeRoutes } from './shared/constants/constants';

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
  const ignoreMethods =
    process.env.STAGE == 'dev'
      ? ['GET', 'HEAD', 'OPTIONS', 'DELETE', 'POST', 'PATCH', 'PUT']
      : ['GET', 'HEAD', 'OPTIONS', 'DELETE'];

  const csrfProtection = csurf({
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: 300
      // sameSite: 'none',
    },
    ignoreMethods
  });
  app.use((req, res, next) => {
    if (csrfExcludeRoutes.includes(req.path)) {
      return next();
    }
    csrfProtection(req, res, next);
  });

  app.set('trust proxy', 1);

  app.use(helmet.contentSecurityPolicy());
  app.use(helmet.crossOriginEmbedderPolicy());
  app.use(helmet.crossOriginOpenerPolicy());
  app.use(helmet.crossOriginResourcePolicy());
  app.use(helmet.dnsPrefetchControl());
  app.use(helmet.expectCt());
  app.use(helmet.frameguard());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());
  app.use(helmet.originAgentCluster());
  app.use(
    helmet.permittedCrossDomainPolicies({
      permittedPolicies: 'by-content-type'
    })
  );
  app.use(helmet.referrerPolicy());
  app.use(helmet.xssFilter());
  app.use(xss()); // XSS Filter
  app.use(hpp()); // Prevent http Parameter pollution
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(validationErrors);
      },
      whitelist: true
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
