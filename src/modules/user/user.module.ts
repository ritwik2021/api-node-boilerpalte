import { Module } from '@nestjs/common';

import { ResponseModel } from '../../shared/model/responseModel';
import { FileUpload } from '../../shared/utils/s3.upload';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, ResponseModel, FileUpload]
})
export class UsersModule {}
