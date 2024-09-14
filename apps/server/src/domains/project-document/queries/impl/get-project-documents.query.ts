// apps/server/src/domains/project-document/queries/impl/get-project-documents.query.ts
import { IQuery } from '@nestjs/cqrs';

export class GetProjectDocumentsQuery implements IQuery {
  constructor(
    public readonly projectId: string,
    public readonly limit: number,
    public readonly page: number,
  ) {}
}
