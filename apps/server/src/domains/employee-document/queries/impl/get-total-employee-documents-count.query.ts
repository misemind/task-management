// apps/server/src/domains/employee-document/queries/impl/get-total-employee-documents-count.query.ts
import { IQuery } from '@nestjs/cqrs';

export class GetTotalEmployeeDocumentsCountQuery implements IQuery {
  constructor(public readonly employeeId: string) {}
}
