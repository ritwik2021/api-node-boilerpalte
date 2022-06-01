import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import config from './shared/config/config';
import { AppController } from './app.controller';
import { MultiChainSdkModule } from './library/multi-chain-sdk/multi-chain-sdk.module';
import { MultiRouteSdkModule } from './library/multi-route-sdk/multi-route-sdk.module';
import { TokensModule } from './modules/tokens/tokens.module';
import ormconfig from './shared/config/ormconfig';
import { LoggerMiddleware } from './shared/logger/logger.middleware';
import { TokensController } from './modules/tokens/tokens.controller';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from './shared/logger/logger.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    TypeOrmModule.forRoot(ormconfig),
    WinstonModule.forRoot(loggerConfig),
    ScheduleModule.forRoot(),
    MultiChainSdkModule,
    MultiRouteSdkModule,
    TokensModule
  ],
  controllers: [AppController]
})
export class AppModule implements NestModule {
  configure(middleware: MiddlewareConsumer) {
    middleware.apply(LoggerMiddleware).forRoutes(TokensController);
  }
}
