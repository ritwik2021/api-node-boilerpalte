import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../../entities/user.entity';

export const GetUser = createParamDecorator((_data, context: ExecutionContext): Promise<User> => {
  const ctx = context.switchToHttp().getRequest();
  return ctx.req.user;
});
