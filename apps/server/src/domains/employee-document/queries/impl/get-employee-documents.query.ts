// apps/server/src/domains/employee-document/queries/impl/get-employee-documents.query.ts
import { IQuery } from '@nestjs/cqrs';

export class GetEmployeeDocumentsQuery implements IQuery {
  constructor(
    public readonly employeeId: string,
    public readonly limit: number,
    public readonly page: number,
  ) {}
}
