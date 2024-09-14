import { ICommand } from '@nestjs/cqrs';

export class DeleteIssueTypeCommand implements ICommand {
  constructor(public readonly id: string) {}
}