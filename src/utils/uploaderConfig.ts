import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

export default class Uploader {
  s3Client: S3Client;

  constructor(region: string) {
    this.s3Client = new S3Client({
      region: region,
    });
  }

  /**
   *
   * @param {string} bucketName
   * @param {string} key
   * @param {Readable | ReadableStream | Blob | string | Uint8Array | Buffer} body
   * @param {string} mimeType
   * @returns {Promise<PutObjectCommandOutput>}
   */
  async uploadFile(
    bucketName: string,
    key: string,
    body: Readable | ReadableStream | Blob | string | Uint8Array | Buffer,
    mimeType: string
  ): Promise<PutObjectCommandOutput> {
    return await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: body,
        Metadata: {
          'Content-Type': mimeType,
        },
      })
    );
  }
}
