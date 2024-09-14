import { ICommand } from '@nestjs/cqrs';
import { CreateIssueDto } from '@app/domains/issue/dto/create-issue.dto';

export class CreateIssueCommand implements ICommand {
  constructor(public readonly createIssueDto: CreateIssueDto) {}
}