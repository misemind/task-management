// apps/server/src/domains/project-document/queries/handlers/get-total-project-documents-count.handler.ts
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProjectDocumentRepository } from '@app/domains/project-document/repositories/project-document.repository';
import { GetTotalProjectDocumentsCountQuery } from '@app/domains/project-document/queries/impl/get-total-project-documents-count.query';

@QueryHandler(GetTotalProjectDocumentsCountQuery)
export class GetTotalProjectDocumentsCountHandler implements IQueryHandler<GetTotalProjectDocumentsCountQuery> {
  constructor(private readonly projectDocumentRepository: ProjectDocumentRepository) {}

  async execute(query: GetTotalProjectDocumentsCountQuery): Promise<number> {
    return this.projectDocumentRepository.countDocuments(query.projectId);
  }
}
