import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IssueTypeRepository } from '@app/domains/issue-type/repositories/issue-type.repository';
import { UpdateIssueTypeCommand } from '@app/domains/issue-type/commands/impl/update-issue-type.command';
import { IssueType } from '@app/domains/issue-type/entities/issue-type.entity';
import { NotFoundException, Injectable } from '@nestjs/common';

@CommandHandler(UpdateIssueTypeCommand)
@Injectable()
export class UpdateIssueTypeHandler implements ICommandHandler<UpdateIssueTypeCommand> {
  constructor(private readonly issueTypeRepository: IssueTypeRepository) {}

  async execute(command: UpdateIssueTypeCommand): Promise<IssueType | null> {
    const existingIssueType = await this.issueTypeRepository.findById(command.id);

    if (!existingIssueType) {
      throw new NotFoundException('IssueType not found');
    }

    const updatedIssueType = await this.issueTypeRepository.update(command.id, command.updateIssueTypeDto);
    return updatedIssueType;
  }
}