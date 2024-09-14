// apps/server/src/domains/employee-document/queries/handlers/get-employee-documents.handler.ts
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EmployeeDocumentRepository } from '@app/domains/employee-document/repositories/employee-document.repository';
import { GetEmployeeDocumentsQuery } from '@app/domains/employee-document/queries/impl/get-employee-documents.query';
import { EmployeeDocument } from '@app/domains/employee-document/entities/employee-document.entity';

@QueryHandler(GetEmployeeDocumentsQuery)
export class GetEmployeeDocumentsHandler implements IQueryHandler<GetEmployeeDocumentsQuery> {
  constructor(private readonly employeeDocumentRepository: EmployeeDocumentRepository) {}

  async execute(query: GetEmployeeDocumentsQuery): Promise<{ data: EmployeeDocument[]; total: number }> {
    const { employeeId, limit, page } = query;
    const skip = (page - 1) * limit;

    // Get the total count of employee documents
    const total = await this.employeeDocumentRepository.countDocuments(employeeId);

    // Get the paginated list of employee documents
    const data = await this.employeeDocumentRepository.findAllWithPagination(employeeId, limit, skip);

    return { data, total };
  }
}
