// apps/server/src/domains/project-document/queries/handlers/get-project-documents.handler.ts
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProjectDocumentRepository } from '@app/domains/project-document/repositories/project-document.repository';
import { GetProjectDocumentsQuery } from '@app/domains/project-document/queries/impl/get-project-documents.query';
import { ProjectDocument } from '@app/domains/project-document/entities/project-document.entity';

@QueryHandler(GetProjectDocumentsQuery)
export class GetProjectDocumentsHandler implements IQueryHandler<GetProjectDocumentsQuery> {
  constructor(private readonly projectDocumentRepository: ProjectDocumentRepository) {}

  async execute(query: GetProjectDocumentsQuery): Promise<{ data: ProjectDocument[]; total: number }> {
    const { projectId, limit, page } = query;
    const skip = (page - 1) * limit;

    // Get the total count of project documents
    const total = await this.projectDocumentRepository.countDocuments(projectId);

    // Get the paginated list of project documents
    const data = await this.projectDocumentRepository.findAllWithPagination(projectId, limit, skip);

    return { data, total };
  }
}
