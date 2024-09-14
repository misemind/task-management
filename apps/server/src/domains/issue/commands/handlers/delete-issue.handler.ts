import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IssueRepository } from '@app/domains/issue/repositories/issue.repository';
import { DeleteIssueCommand } from '@app/domains/issue/commands/impl/delete-issue.command';
import { Issue } from '@app/domains/issue/entities/issue.entity';

@CommandHandler(DeleteIssueCommand)
export class DeleteIssueHandler implements ICommandHandler<DeleteIssueCommand> {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(command: DeleteIssueCommand): Promise<Issue | null> {
    const { id } = command;
    return this.issueRepository.delete(id);
  }
}