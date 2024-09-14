import { ICommand } from '@nestjs/cqrs';

export class DeleteIssueCommand implements ICommand {
  constructor(public readonly id: string) {}
}