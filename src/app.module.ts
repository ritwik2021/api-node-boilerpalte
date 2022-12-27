import { Module, MiddlewareConsumer, NestModule, CacheModule, CacheInterceptor } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { WinstonModule } from 'nest-winston';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

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
import { ResponseModel } from './shared/model/responseModel';

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
