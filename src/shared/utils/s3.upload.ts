import { S3 } from 'aws-sdk';
import { Injectable, Logger } from '@nestjs/common';
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileUpload {
  constructor(private readonly configService: ConfigService) {}
  /**
   * @description it will genrate a preSinged url for s3 bucket
   * @param fileName
   * @param fileType
   * @param filePath
   * @returns will return signed url
   * @author Ritwik Rohitashwa
   */

  async signedUrl(fileName, fileType, filePath): Promise<any> {
    console.log({
      region: process.env.AWS_S3_REGION,
      Bucket: process.env.AWS_S3_BUCKET_NAME
    });
    const s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_S3_REGION,
      signatureVersion: 'v4'
    });

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${filePath}/${Date.now()}-${fileName}`,
      Expires: 60,
      ContentType: fileType
    };

    const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
    return uploadUrl;
  }
}
