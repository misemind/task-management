import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IssueRepository } from '@app/domains/issue/repositories/issue.repository';
import { GetIssuesByProjectIdQuery } from '@app/domains/issue/queries/impl/get-issues-by-project-id.query';
import { Issue } from '@app/domains/issue/entities/issue.entity';

@QueryHandler(GetIssuesByProjectIdQuery)
export class GetIssuesByProjectIdHandler implements IQueryHandler<GetIssuesByProjectIdQuery> {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(query: GetIssuesByProjectIdQuery): Promise<Issue[]> {
    const { projectId, limit, page } = query;
    const skip = (page - 1) * limit;

    return this.issueRepository.findByProjectIdWithPagination(projectId, limit, skip);
  }
}