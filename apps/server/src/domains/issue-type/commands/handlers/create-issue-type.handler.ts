import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IssueTypeRepository } from '@app/domains/issue-type/repositories/issue-type.repository';
import { CreateIssueTypeCommand } from '@app/domains/issue-type/commands/impl/create-issue-type.command';
import { IssueType } from '@app/domains/issue-type/entities/issue-type.entity';
import { Injectable } from '@nestjs/common';

@CommandHandler(CreateIssueTypeCommand)
@Injectable()
export class CreateIssueTypeHandler implements ICommandHandler<CreateIssueTypeCommand> {
  constructor(private readonly issueTypeRepository: IssueTypeRepository) {}

  async execute(command: CreateIssueTypeCommand): Promise<IssueType> {
    const { createIssueTypeDto } = command;
    const createdIssueType = await this.issueTypeRepository.create(createIssueTypeDto);
    return createdIssueType;
  }
}