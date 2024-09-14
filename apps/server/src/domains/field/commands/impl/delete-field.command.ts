import { ICommand } from '@nestjs/cqrs';

export class DeleteFieldCommand implements ICommand {
  constructor(public readonly id: string) {}
}