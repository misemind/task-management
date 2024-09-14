import { Module } from '@nestjs/common';
import { DocumentService } from './common/services/document.service';
import { MinioModule } from '@app/infrastructure/cloud/minio/minio.module';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [MinioModule,LoggerModule], // Import the MinioModule if it's not globally available
  providers: [DocumentService],
  exports: [DocumentService,LoggerModule], // Export the DocumentService so it can be used in other modules
})
export class CoreModule {}
