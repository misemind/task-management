import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IssueTypeRepository } from '@app/domains/issue-type/repositories/issue-type.repository';
import { GetIssueTypeByIdQuery } from '@app/domains/issue-type/queries/impl/get-issue-type-by-id.query';
import { IssueType } from '@app/domains/issue-type/entities/issue-type.entity';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetIssueTypeByIdQuery)
export class GetIssueTypeByIdHandler implements IQueryHandler<GetIssueTypeByIdQuery> {
  constructor(private readonly issueTypeRepository: IssueTypeRepository) {}

  async execute(query: GetIssueTypeByIdQuery): Promise<IssueType | null> {
    const issueType = await this.issueTypeRepository.findById(query.id);

    if (!issueType) {
      throw new NotFoundException(`IssueType not found with ID: ${query.id}`);
    }

    return issueType;
  }
}