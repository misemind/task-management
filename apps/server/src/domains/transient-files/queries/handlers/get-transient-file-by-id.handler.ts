import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TransientFileRepository } from '@app/domains/transient-files/repositories/transient-file.repository';
import { GetTransientFileByIdQuery } from '@app/domains/transient-files/queries/impl/get-transient-file-by-id.query';
import { TransientFile } from '@app/domains/transient-files/entities/transient-file.entity';

@QueryHandler(GetTransientFileByIdQuery)
export class GetTransientFileByIdHandler implements IQueryHandler<GetTransientFileByIdQuery> {
  constructor(private readonly transientFileRepository: TransientFileRepository) {}

  async execute(query: GetTransientFileByIdQuery): Promise<TransientFile | null> {
    const { id } = query;
    return this.transientFileRepository.findById(id);
  }
}
