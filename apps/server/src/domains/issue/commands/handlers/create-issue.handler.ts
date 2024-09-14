import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IssueRepository } from '@app/domains/issue/repositories/issue.repository';
import { CreateIssueCommand } from '@app/domains/issue/commands/impl/create-issue.command';
import { Issue } from '@app/domains/issue/entities/issue.entity';
import { Injectable } from '@nestjs/common';

@CommandHandler(CreateIssueCommand)
@Injectable()
export class CreateIssueHandler implements ICommandHandler<CreateIssueCommand> {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(command: CreateIssueCommand): Promise<Issue> {
    const { createIssueDto } = command;
    const createdIssue = await this.issueRepository.create(createIssueDto);
    return createdIssue;
  }
}