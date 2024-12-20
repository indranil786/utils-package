import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Readable } from 'stream';

export default class Uploader {
  s3Client: S3Client;

  constructor(region: string, accessKey: string, secretKey: string) {
    this.s3Client = new S3Client({
      region: region,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
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
  async uploadMultiFiles(
    bucketName: string,
    key: string,
    fileArray: {
      name: string;
      data: Readable | ReadableStream | Blob | string | Uint8Array | Buffer;
    }[]
  ): Promise<{ fileName: string; fileUrl: string }[]> {
    const uploadedFiles: { fileName: string; fileUrl: string }[] = [];
    const uploadPromises = [];
    for (const file of fileArray) {
      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: bucketName,
          Key: `${key}/${file.name}`,
          Body: file.data,
        },
      });
      uploadPromises.push(
        upload.done().then((res: any) => {
          uploadedFiles.push({
            fileName: file.name,
            fileUrl: res?.Location,
          });
        })
      );
    }
    await Promise.all(uploadPromises);

    return uploadedFiles;
  }
}
