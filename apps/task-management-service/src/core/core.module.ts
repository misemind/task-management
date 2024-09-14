import { Module } from '@nestjs/common';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [LoggerModule], // Import the MinioModule if it's not globally available
  providers: [],
  exports: [LoggerModule], // Export the DocumentService so it can be used in other modules
})
export class CoreModule {}
