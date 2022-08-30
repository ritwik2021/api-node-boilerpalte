import { S3 } from 'aws-sdk';
import { Injectable } from '@nestjs/common';
import 'dotenv/config';

@Injectable()
export class FileUpload {
  /**
   * @description it will genrate a preSinged url for s3 bucket
   * @param fileName
   * @param fileType
   * @param filePath
   * @returns will return signed url
   * @author Ritwik Rohitashwa
   */

  async signedUrl(fileName, fileType, filePath): Promise<any> {
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

    return s3.getSignedUrlPromise('putObject', params);
  }
}
