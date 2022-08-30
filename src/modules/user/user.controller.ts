import { Body, Controller, Post, Response } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'shared/constants/ResponseMessage';
import { ResponseStatusCode } from 'shared/constants/ResponseStatusCode';
import { SignedUrlDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  /**
   * @description it will genrate singed url for s3 bucket
   * @param SignedUrlDto
   * @param response
   * @returns it will return signed url
   * @author Ritwik Rohitashwa
   */
  @ApiTags('User Module')
  @ApiOperation({
    summary: 'Get pre-signed url with given filename and filetype'
  })
  @ApiResponse({ status: ResponseStatusCode.OK, description: ResponseMessage.PRESIGNED_URL })
  @ApiBadRequestResponse({ description: ResponseMessage.INVALID_CRED_OR_TOKEN_EXPIRED })
  @ApiConflictResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR
  })
  @Post('/getPresignedURL')
  async getPresignedURL(@Body() signedUrlDto: SignedUrlDto, @Response() response): Promise<any> {
    return this.userService.getPresignedURL(signedUrlDto, response);
  }
}
