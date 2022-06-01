import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import xss from 'xss-clean';
import hpp from 'hpp';

import { AppModule } from './app.module';
import { configureSwagger } from './shared/swagger/swagger';
// import { ipRateLimitMiddleware } from './shared/rate-limit/rate-limit';

async function main() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const envApp = await app.get(ConfigService).get('NODE_ENV');
  const port = await app.get(ConfigService).get('NODE_PORT');
  const allowedDomains = await app.get(ConfigService).get('ALLOWED_DOMAINS');
  const whitelist = allowedDomains.split(',');
  app.setGlobalPrefix(await app.get(ConfigService).get('GLOBAL_PRIFIX'));

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

  app.use(helmet({ hidePoweredBy: true })); //Security purpose to hide unwanted headers
  app.use(compression()); // Compression Settings
  app.use(xss()); // XSS Filter
  app.use(hpp()); // Prevent http Parameter pollution
  // app.use(ipRateLimitMiddleware); // Rate Limit Settings

  // swagger middleware
  if (envApp !== 'prod') {
    configureSwagger(app);
  }

  await app.listen(port, () => {
    Logger.log(`${envApp} Server is running on ${port}`, `Application Server`);
  });
}
main();
