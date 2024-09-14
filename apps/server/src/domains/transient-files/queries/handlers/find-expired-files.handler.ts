import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TransientFileRepository } from '@app/domains/transient-files/repositories/transient-file.repository';
import { FindExpiredFilesQuery } from '@app/domains/transient-files/queries/impl/find-expired-files.query';
import { TransientFile } from '@app/domains/transient-files/entities/transient-file.entity';

@QueryHandler(FindExpiredFilesQuery)
export class FindExpiredFilesHandler implements IQueryHandler<FindExpiredFilesQuery> {
    constructor(private readonly transientFileRepository: TransientFileRepository) { }

    async execute(query: FindExpiredFilesQuery): Promise<TransientFile[]> {
        const { currentDate } = query;
        return this.transientFileRepository.findExpiredFiles(currentDate);
    }
}
