import { ICommand } from '@nestjs/cqrs';
import { UpdateIssueTypeDto } from '@app/domains/issue-type/dto/update-issue-type.dto';

export class UpdateIssueTypeCommand implements ICommand {
  constructor(public readonly id: string, public readonly updateIssueTypeDto: UpdateIssueTypeDto) {}
}