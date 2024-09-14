import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTransientFileCommand } from '@app/domains/transient-files/commands/impl/create-transient-file.command';
import { DeleteTransientFileCommand } from '@app/domains/transient-files/commands/impl/delete-transient-file.command';
import { TransientFile } from '@app/domains/transient-files/entities/transient-file.entity';
import { GetTransientFileByIdQuery } from '@app/domains/transient-files/queries/impl/get-transient-file-by-id.query';
import { GetAllTransientFilesQuery } from '@app/domains/transient-files/queries/impl/get-all-transient-files.query';
import { GeneratePresignedUrlDto } from '@app/domains/transient-files/dto/generate-presigned-url.dto';
import { MinioService } from '@app/infrastructure/cloud/minio/minio.service';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class TransientFileService {
    constructor(private commandBus: CommandBus, private queryBus: QueryBus, private minioService: MinioService,) { }

    async createTransientFile(filePath: string, expiresAt: Date): Promise<TransientFile> {
        try {
            return await this.commandBus.execute(new CreateTransientFileCommand(filePath, expiresAt));
        } catch (error) {
            console.log('TransientFileService createTransientFile',error);
            throw new InternalServerErrorException('Failed to create transient file');
        }
    }

    async deleteTransientFile(id: string): Promise<TransientFile | null> {
        try {
            const transientFile = await this.commandBus.execute(new DeleteTransientFileCommand(id));
            if (!transientFile) {
                throw new NotFoundException('Transient file not found');
            }
            return transientFile;
        } catch (error) {
            console.log('TransientFileService deleteTransientFile',error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to delete transient file');
        }
    }

    async getTransientFileById(id: string): Promise<TransientFile | null> {
        try {
            const transientFile = await this.queryBus.execute(new GetTransientFileByIdQuery(id));
            if (!transientFile) {
                throw new NotFoundException('Transient file not found');
            }
            return transientFile;
        } catch (error) {
            console.log('TransientFileService getTransientFileById',error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to retrieve transient file');
        }
    }

    async listAllTransientFiles(limit = 10, page = 1): Promise<TransientFile[]> {
        try {
            return await this.queryBus.execute(new GetAllTransientFilesQuery(limit, page));
        } catch (error) {
            console.log('TransientFileService listAllTransientFiles',error);
            throw new InternalServerErrorException('Failed to retrieve transient files');
        }
    }
    async generatePresignedUrlAndCreateEntry(dto: GeneratePresignedUrlDto): Promise<{ presignedUrl: string; filePath: string }> {
        const { fileName, expiresInSeconds = 3600, method } = dto;
    
        // Extract file extension
        const fileExtension = fileName.split('.').pop();
        const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    
        // Generate the presigned URL
        const presignedUrl = await this.minioService.generatePresignedUrl(
            uniqueFileName,
            method
        );
    
        // Create the entry in the TransientFile collection
        const filePath = `${uniqueFileName}`;
        const expiresAt = new Date(Date.now() + (expiresInSeconds || 3600) * 1000);
        await this.createTransientFile(filePath, expiresAt);
    
        // Return both the presigned URL and the file path
        return { presignedUrl, filePath };
    }

}
