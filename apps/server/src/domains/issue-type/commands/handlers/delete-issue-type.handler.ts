import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IssueTypeRepository } from '@app/domains/issue-type/repositories/issue-type.repository';
import { DeleteIssueTypeCommand } from '@app/domains/issue-type/commands/impl/delete-issue-type.command';
import { IssueType } from '@app/domains/issue-type/entities/issue-type.entity';

@CommandHandler(DeleteIssueTypeCommand)
export class DeleteIssueTypeHandler implements ICommandHandler<DeleteIssueTypeCommand> {
  constructor(private readonly issueTypeRepository: IssueTypeRepository) {}

  async execute(command: DeleteIssueTypeCommand): Promise<IssueType | null> {
    const { id } = command;
    return this.issueTypeRepository.delete(id);
  }
}