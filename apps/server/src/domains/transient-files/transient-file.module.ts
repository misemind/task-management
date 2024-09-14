import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { TransientFile, TransientFileSchema } from './entities/transient-file.entity';
import { TransientFileService } from './services/transient-file.service';
import { TransientFileRepository } from './repositories/transient-file.repository';
import { TransientFileCommandHandlers } from './commands';
import { TransientFileQueryHandlers } from './queries';
import { TransientFileController } from './controllers/transient-file.controller';
import { TransientFileCleanupCron } from './cron/transient-file-cleanup.cron';
import { MinioModule } from '@app/infrastructure/cloud/minio/minio.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TransientFile.name, schema: TransientFileSchema }]),
    CqrsModule,
    MinioModule
  ],
  providers: [
    TransientFileService,
    TransientFileRepository,
    ...TransientFileCommandHandlers,
    ...TransientFileQueryHandlers,
    TransientFileCleanupCron, // Add the cron service here
  ],
  controllers: [TransientFileController],
  exports: [TransientFileService],
})
export class TransientFileModule { }
