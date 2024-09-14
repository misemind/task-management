import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { QueryBus } from '@nestjs/cqrs';
import { TransientFileService } from '@app/domains/transient-files/services/transient-file.service';
import { MinioService } from '@app/infrastructure/cloud/minio/minio.service';
import { FindExpiredFilesQuery } from '@app/domains/transient-files/queries/impl/find-expired-files.query';

@Injectable()
export class TransientFileCleanupCron {
    private readonly logger = new Logger(TransientFileCleanupCron.name);

    constructor(
        private readonly queryBus: QueryBus,
        private readonly transientFileService: TransientFileService,
        private readonly minioService: MinioService,
    ) { }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async handleCleanup() {
        this.logger.log('Running transient files cleanup...');

        const currentDate = new Date();
        const expiredFiles = await this.queryBus.execute(new FindExpiredFilesQuery(currentDate));

        for (const file of expiredFiles) {
            try {
                // Delete the file from MinIO
                const [entityType, entityId, fileName] = file.filePath.split('/');
                await this.minioService.deleteFile(file.bucketName, file.filePath);

                // Delete the entry from the TransientFile table
                await this.transientFileService.deleteTransientFile(file._id);
                this.logger.log(`Deleted file and entry for ${file.filePath}`);
            } catch (error) {
                this.logger.error(`Failed to delete file or entry for ${file.filePath}: ${error.message}`);
            }
        }
    }
}
