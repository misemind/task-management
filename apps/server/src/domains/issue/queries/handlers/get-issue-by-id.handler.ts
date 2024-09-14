import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IssueRepository } from '@app/domains/issue/repositories/issue.repository';
import { GetIssueByIdQuery } from '@app/domains/issue/queries/impl/get-issue-by-id.query';
import { Issue } from '@app/domains/issue/entities/issue.entity';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetIssueByIdQuery)
export class GetIssueByIdHandler implements IQueryHandler<GetIssueByIdQuery> {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(query: GetIssueByIdQuery): Promise<Issue | null> {
    const issue = await this.issueRepository.findById(query.id);

    if (!issue) {
      throw new NotFoundException(`Issue not found with ID: ${query.id}`);
    }

    return issue;
  }
}