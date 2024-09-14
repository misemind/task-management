import { ICommand } from '@nestjs/cqrs';
import { CreateIssueTypeDto } from '@app/domains/issue-type/dto/create-issue-type.dto';

export class CreateIssueTypeCommand implements ICommand {
  constructor(public readonly createIssueTypeDto: CreateIssueTypeDto) {}
}