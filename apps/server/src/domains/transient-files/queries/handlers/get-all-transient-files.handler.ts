import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TransientFileRepository } from '@app/domains/transient-files/repositories/transient-file.repository';

import { TransientFile } from '@app/domains/transient-files/entities/transient-file.entity';
import { GetAllTransientFilesQuery } from '@app/domains/transient-files/queries/impl/get-all-transient-files.query';

@QueryHandler(GetAllTransientFilesQuery)
export class GetAllTransientFilesHandler implements IQueryHandler<GetAllTransientFilesQuery> {
  constructor(private readonly transientFileRepository: TransientFileRepository) {}

  async execute(query: GetAllTransientFilesQuery): Promise<TransientFile[]> {
    return this.transientFileRepository.findAll(query.limit, query.page);
  }
}
