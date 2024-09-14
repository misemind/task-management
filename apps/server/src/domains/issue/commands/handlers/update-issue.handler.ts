import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IssueRepository } from '@app/domains/issue/repositories/issue.repository';
import { UpdateIssueCommand } from '@app/domains/issue/commands/impl/update-issue.command';
import { Issue } from '@app/domains/issue/entities/issue.entity';
import { NotFoundException, Injectable } from '@nestjs/common';

@CommandHandler(UpdateIssueCommand)
@Injectable()
export class UpdateIssueHandler implements ICommandHandler<UpdateIssueCommand> {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(command: UpdateIssueCommand): Promise<Issue | null> {
    const existingIssue = await this.issueRepository.findById(command.id);

    if (!existingIssue) {
      throw new NotFoundException('Issue not found');
    }

    const updatedIssue = await this.issueRepository.update(command.id, command.updateIssueDto);
    return updatedIssue;
  }
}