import { Injectable } from '@nestjs/common';

import { ResponseStatusCode } from '../../shared/constants/ResponseStatusCode';
import { ResponseModel } from '../../shared/model/responseModel';
import { FileUpload } from '../../shared/utils/s3.upload';
import { SuccessResponse } from '../../shared/interfaces/general.interface';
import { SignedUrlDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly responseModel: ResponseModel, private readonly fileUpload: FileUpload) {}
  /**
   * @description it will genrate preSinged url for s3 bucket
   * @param signedUrlDto
   * @returns it will return preSigned url
   * @author Ritwik Rohitashwa
   */
  async getPresignedURL(signedUrlDto: SignedUrlDto, response: Response): Promise<SuccessResponse> {
    const { fileName, fileType, filePath } = signedUrlDto;
    const url = await this.fileUpload.signedUrl(fileName, fileType, filePath);
    return this.responseModel.response(url, ResponseStatusCode.OK, true, response);
  }
}
