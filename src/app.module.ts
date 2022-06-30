import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import config from './shared/config/config';
import { AppController } from './app.controller';
import ormconfig from './shared/config/ormconfig';
import { LoggerMiddleware } from './shared/logger/logger.middleware';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from './shared/logger/logger.config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersController } from './modules/users/users.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    TypeOrmModule.forRoot(ormconfig),
    WinstonModule.forRoot(loggerConfig),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule
  ],
  controllers: [AppController]
})
export class AppModule implements NestModule {
  configure(middleware: MiddlewareConsumer) {
    middleware.apply(LoggerMiddleware).forRoutes(UsersController);
  }
}
