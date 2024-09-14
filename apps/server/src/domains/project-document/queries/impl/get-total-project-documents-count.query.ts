// apps/server/src/domains/project-document/queries/impl/get-total-project-documents-count.query.ts
import { IQuery } from '@nestjs/cqrs';

export class GetTotalProjectDocumentsCountQuery implements IQuery {
  constructor(public readonly projectId: string) {}
}
