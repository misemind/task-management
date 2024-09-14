import { ICommand } from '@nestjs/cqrs';

export class DeleteSprintCommand implements ICommand {
  constructor(public readonly id: string) {}
}