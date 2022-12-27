import { HttpException, Injectable, Response } from '@nestjs/common';

@Injectable()
export class ResponseModel {
  response(message: any, status: number, success: boolean, @Response() response) {
    return response.status(status).json({
      status,
      success,
      message
    });
  }

  error(message: any, status: number, success: boolean) {
    throw new HttpException({ message, success }, status);
  }
}
