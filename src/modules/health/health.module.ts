import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';

import ormConfig from '../../shared/config/ormconfig';
import config from '../../shared/config/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [config] }), TypeOrmModule.forRoot(ormConfig), TerminusModule],
  controllers: [HealthController]
})
export class HealthModule {}
