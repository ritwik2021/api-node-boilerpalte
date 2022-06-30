import rateLimit from 'express-rate-limit';
import { ConfigService } from '@nestjs/config';
const configService = new ConfigService();

export const ipRateLimitMiddleware = rateLimit({
  windowMs: Number(configService.get('IP_RATE_LIMIT_WINDOWS_MS') || 1 * 1000),
  max: Number(configService.get('IP_RATE_LIMIT_REQ_PER_SEC') || 100),
  message: 'Too many attempts from your IP address. Please wait a few seconds.'
});
