import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateIssueTypeCommand } from '../commands/impl/create-issue-type.command';
import { DeleteIssueTypeCommand } from '../commands/impl/delete-issue-type.command';
import { UpdateIssueTypeCommand } from '../commands/impl/update-issue-type.command';
import { CreateIssueTypeDto } from '../dto/create-issue-type.dto';
import { UpdateIssueTypeDto } from '../dto/update-issue-type.dto';
import { GetIssueTypeByIdQuery } from '../queries/impl/get-issue-type-by-id.query';

@Injectable()
export class IssueTypeService {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  async createIssueType(createIssueTypeDto: CreateIssueTypeDto) {
    return this.commandBus.execute(new CreateIssueTypeCommand(createIssueTypeDto));
  }

  async updateIssueType(id: string, updateIssueTypeDto: UpdateIssueTypeDto) {
    const issueType = await this.commandBus.execute(new UpdateIssueTypeCommand(id, updateIssueTypeDto));
    if (!issueType) {
      throw new NotFoundException('IssueType not found');
    }
    return issueType;
  }

  async deleteIssueType(id: string) {
    const issueType = await this.commandBus.execute(new DeleteIssueTypeCommand(id));
    if (!issueType) {
      throw new NotFoundException('IssueType not found');
    }
    return issueType;
  }

  async getIssueTypeById(id: string) {
    const issueType = await this.queryBus.execute(new GetIssueTypeByIdQuery(id));
    if (!issueType) {
      throw new NotFoundException('IssueType not found');
    }
    return issueType;
  }
}