import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
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
   * @returns {Promise<object>}
   */
  async uploadFile(
    bucketName: string,
    key: string,
    body: Readable | ReadableStream | Blob | string | Uint8Array | Buffer,
    mimeType: string
  ): Promise<object> {
    return await new Upload({
      client: this.s3Client,
      params: {
        Bucket: bucketName,
        Key: key,
        Body: body,
        Metadata: {
          'Content-Type': mimeType,
        },
      },
    }).done();
  }
}