import { Module, MiddlewareConsumer, NestModule, CacheModule, CacheInterceptor } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { WinstonModule } from 'nest-winston';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { SentryModule } from '@ntegral/nestjs-sentry';

import config from './shared/config/config';
import { AppController } from './app.controller';
import { LoggerMiddleware } from './shared/logger/logger.middleware';
import { loggerConfig } from './shared/logger/logger.config';
import { UsersModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { LoggingInterceptor } from './shared/core/logging-interceptor';
import { MailModule } from './modules/mail/mail.module';
import { HealthModule } from './modules/health/health.module';
import { DatabaseModule } from './database/database.module';
import { SentryInterceptor } from './shared/core/sentry-interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get('THROTTLE_TTL'),
        limit: config.get('THROTTLE_LIMIT')
      })
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 60 * 24, //in seconds
      max: 60 * 60 * 24
    }),

    SentryModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dsn: configService.get('SENTRY_DSN'),
        debug: true,
        tracesSampleRate: 0.2,
        environment: configService.get('NODE_ENV') || 'dev',
        release: `alpha@0.0.1`, // must create a release in sentry.io dashboard
        logLevel: ['debug'] //based on sentry.io loglevel //
      })
    }),

    WinstonModule.forRoot(loggerConfig),
    ScheduleModule.forRoot(),
    DatabaseModule,
    UsersModule,
    AuthModule,
    MailModule,
    HealthModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    },
    {
      provide: APP_INTERCEPTOR,
      useValue: new SentryInterceptor()
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule implements NestModule {
  configure(middleware: MiddlewareConsumer) {
    middleware.apply(LoggerMiddleware).forRoutes('/');
  }
}
