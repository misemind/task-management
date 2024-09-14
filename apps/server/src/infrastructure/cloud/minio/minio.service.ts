import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { Readable } from 'stream';

@Injectable()
export class MinioService implements OnModuleInit {
  private minioClient: Minio.Client;
  private readonly logger = new Logger(MinioService.name);
  private expiresInSeconds: number;
  constructor(private readonly configService: ConfigService) { }

  async onModuleInit() {
    try {
      const endPoint = this.configService.get<string>('MINIO_ENDPOINT');
      const port = parseInt(this.configService.get<string>('MINIO_PORT'), 10);
      const useSSL = this.configService.get<string>('MINIO_USE_SSL') === 'true';
      const accessKey = this.configService.get<string>('MINIO_ACCESS_KEY');
      const secretKey = this.configService.get<string>('MINIO_SECRET_KEY');
      this.expiresInSeconds = this.configService.get<number>('MINIO_EXPIRES_IN_SECONDS') || 3600;
      if (!endPoint) throw new Error('MINIO_ENDPOINT is not defined');
      if (!port) throw new Error('MINIO_PORT is not defined');
      if (!accessKey) throw new Error('MINIO_ACCESS_KEY is not defined');
      if (!secretKey) throw new Error('MINIO_SECRET_KEY is not defined');

      this.minioClient = new Minio.Client({
        endPoint,
        port,
        useSSL,
        accessKey,
        secretKey,
      });

      // Test the connection by checking if a bucket exists
      //await this.bucketExists('documents');
      this.logger.log('MinIO client successfully initialized.');
    } catch (error) {
      this.minioClient = null;
      this.logger.error('Failed to initialize MinIO client', error.message);
    }
  }
  async generatePresignedUrl(
    fileName: string,
    operation: 'GET' | 'PUT'
  ): Promise<string> {
    if (!this.minioClient) {
      this.logger.error('MinIO client is not initialized.');
      throw new Error('MinIO client is not initialized.');
    }

    const bucketName = this.configService.get<string>('SOURCE_BUCKET_NAME');
    const bucketExists = await this.bucketExists(bucketName);
    if (!bucketExists) {
      await this.createBucket(bucketName);
    }

    const objectName = `${fileName}`;
    return this.minioClient.presignedUrl(operation, bucketName, objectName, this.expiresInSeconds);
  }
  async generateSignedUrl(bucketName: string, objectName: string, expiresInSeconds: number): Promise<string> {
    return this.minioClient.presignedUrl('GET', bucketName, objectName, expiresInSeconds);
  }

  async moveFile(sourceBucket: string, destinationBucket: string, sourceObjectName: string, destinationObjectName: string): Promise<void> {
    const fileStream: Readable = await this.downloadFileAsStream(sourceBucket, sourceObjectName);

    // Step 2: Get the metadata of the original file to preserve the content type
    const metadata = await this.minioClient.statObject(sourceBucket, sourceObjectName);

    // Step 3: Upload the Node.js Readable stream to the destination bucket with the same Content-Type
    await this.uploadFile(destinationBucket, destinationObjectName, fileStream, { 'Content-Type': metadata.metaData['content-type'] });

    // Step 4: Delete the file from the source bucket
    await this.deleteFile(sourceBucket, sourceObjectName);
  }

  async uploadFile(bucketName: string, objectName: string, fileStream: Readable, metadata?: Minio.ItemBucketMetadata): Promise<void> {
    if (!this.minioClient) {
      throw new Error('MinIO client is not initialized.');
    }

    // Step 4: Upload the Node.js Readable stream to MinIO with metadata
    await this.minioClient.putObject(bucketName, objectName, fileStream, undefined, metadata);
  }

  async downloadFile(bucketName: string, objectName: string): Promise<Buffer> {
    if (!this.minioClient) {
      this.logger.error('MinIO client is not initialized.');
      throw new Error('MinIO client is not initialized.');
    }
    const dataStream: Readable = await this.minioClient.getObject(bucketName, objectName);

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      dataStream.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });
      dataStream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      dataStream.on('error', reject);
    });
  }

  async downloadFileAsStream(bucketName: string, objectName: string): Promise<Readable> {
    if (!this.minioClient) {
      this.logger.error('MinIO client is not initialized.');
      throw new Error('MinIO client is not initialized.');
    }
    return this.minioClient.getObject(bucketName, objectName);
  }

  async deleteFile(bucketName: string, objectName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(bucketName, objectName);
    } catch (error) {
      console.error(`Failed to delete object ${objectName} from bucket ${bucketName}:`, error);
      throw new Error('Failed to delete file');
    }
  }

  async createBucket(bucketName: string) {
    if (!this.minioClient) {
      this.logger.error('MinIO client is not initialized.');
      return;
    }
    const exists = await this.minioClient.bucketExists(bucketName);
    if (!exists) {
      await this.minioClient.makeBucket(bucketName, '');
    }
  }




  async deleteBucket(bucketName: string) {
    if (!this.minioClient) {
      this.logger.error('MinIO client is not initialized.');
      return;
    }
    await this.minioClient.removeBucket(bucketName);
  }

  async bucketExists(bucketName: string): Promise<boolean> {
    if (!this.minioClient) {
      this.logger.error('MinIO client is not initialized.');
      return false;
    }
    try {
      return await this.minioClient.bucketExists(bucketName);
    } catch (error) {
      this.logger.error(`Error checking if bucket '${bucketName}' exists:`, error);
      return false;
    }
  }

  async listObjects(bucketName: string, prefix: string): Promise<string[]> {
    const stream = this.minioClient.listObjectsV2(bucketName, prefix, true);
    return new Promise((resolve, reject) => {
      const items: string[] = [];
      stream.on('data', (obj) => {
        if (obj.name.startsWith(prefix)) {
          items.push(obj.name);
        }
      });
      stream.on('end', () => {
        resolve(items);
      });
      stream.on('error', (err) => {
        reject(err);
      });
    });
  }
}
