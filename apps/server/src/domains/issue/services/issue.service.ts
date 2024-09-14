import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateIssueCommand } from '../commands/impl/create-issue.command';
import { DeleteIssueCommand } from '../commands/impl/delete-issue.command';
import { UpdateIssueCommand } from '../commands/impl/update-issue.command';
import { CreateIssueDto } from '../dto/create-issue.dto';
import { UpdateIssueDto } from '../dto/update-issue.dto';
import { GetIssueByIdQuery } from '../queries/impl/get-issue-by-id.query';
import { GetIssuesByProjectIdQuery } from '../queries/impl/get-issues-by-project-id.query';
import { PaginationDto } from '@app/domains/shared/dto/pagination.dto';

@Injectable()
export class IssueService {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  async createIssue(createIssueDto: CreateIssueDto) {
    return this.commandBus.execute(new CreateIssueCommand(createIssueDto));
  }

  async updateIssue(id: string, updateIssueDto: UpdateIssueDto) {
    const issue = await this.commandBus.execute(new UpdateIssueCommand(id, updateIssueDto));
    if (!issue) {
      throw new NotFoundException('Issue not found');
    }
    return issue;
  }

  async deleteIssue(id: string) {
    const issue = await this.commandBus.execute(new DeleteIssueCommand(id));
    if (!issue) {
      throw new NotFoundException('Issue not found');
    }
    return issue;
  }

  async getIssueById(id: string) {
    const issue = await this.queryBus.execute(new GetIssueByIdQuery(id));
    if (!issue) {
      throw new NotFoundException('Issue not found');
    }
    return issue;
  }

  async getIssuesByProjectId(projectId: string, paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    return this.queryBus.execute(new GetIssuesByProjectIdQuery(projectId, limit, page));
  }
}