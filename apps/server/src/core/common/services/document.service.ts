import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { MinioService } from '@app/infrastructure/cloud/minio/minio.service';
import { Readable } from 'stream';

@Injectable()
export class DocumentService implements OnModuleInit {
  private readonly bucketName = 'documents';

  constructor(private readonly minioService: MinioService) {}

  async onModuleInit() {
    // Check if the bucket exists, and create it if it doesn't
   // const bucketExists = await this.minioService.bucketExists(this.bucketName);
    // if (!bucketExists) {
    //   await this.minioService.createBucket(this.bucketName);
    //   console.log(`Bucket '${this.bucketName}' created.`);
    // } else {
    //   console.log(`Bucket '${this.bucketName}' already exists.`);
    // }
  }

  // async uploadDocument(entityType: string, entityId: string, file: Express.Multer.File) {
  //   const objectName = `${entityType}/${entityId}/${file.originalname}`;
  //   await this.minioService.uploadFile(this.bucketName, objectName, file.buffer, {});
  //   return { message: 'File uploaded successfully', objectName };
  // }

  async downloadDocument(objectName:string): Promise<Buffer> {
    return this.minioService.downloadFile(this.bucketName, objectName);
  }

  async downloadDocumentAsStream(objectName:string): Promise<Readable> {
    const documentStream = await this.minioService.downloadFileAsStream(this.bucketName, objectName);
    if (!documentStream) {
      throw new NotFoundException('Document not found');
    }
    return documentStream;
  }

  async deleteDocument(objectName:string) {
    await this.minioService.deleteFile(this.bucketName, objectName);
    return { message: 'File deleted successfully' };
  }  

  async listDocuments(entityType: string, entityId: string): Promise<string[]> {
    const prefix = `${entityType}/${entityId}/`;
    return this.minioService.listObjects(this.bucketName, prefix);
  }     
}
