import { ICommand } from '@nestjs/cqrs';
import { UpdateIssueDto } from '@app/domains/issue/dto/update-issue.dto';

export class UpdateIssueCommand implements ICommand {
  constructor(public readonly id: string, public readonly updateIssueDto: UpdateIssueDto) {}
}