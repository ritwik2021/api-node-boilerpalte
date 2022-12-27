import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { HealthCheckExecutor } from '@nestjs/terminus/dist/health-check/health-check-executor.service';

@Module({
  controllers: [HealthController],
  providers: [HealthCheckService, HealthCheckExecutor, TypeOrmHealthIndicator]
})
export class HealthModule {}
