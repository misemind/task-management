// apps/server/src/domains/employee-document/queries/handlers/get-total-employee-documents-count.handler.ts
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EmployeeDocumentRepository } from '@app/domains/employee-document/repositories/employee-document.repository';
import { GetTotalEmployeeDocumentsCountQuery } from '@app/domains/employee-document/queries/impl/get-total-employee-documents-count.query';

@QueryHandler(GetTotalEmployeeDocumentsCountQuery)
export class GetTotalEmployeeDocumentsCountHandler implements IQueryHandler<GetTotalEmployeeDocumentsCountQuery> {
  constructor(private readonly employeeDocumentRepository: EmployeeDocumentRepository) {}

  async execute(query: GetTotalEmployeeDocumentsCountQuery): Promise<number> {
    const { employeeId } = query;
    return this.employeeDocumentRepository.countDocuments(employeeId);
  }
}
