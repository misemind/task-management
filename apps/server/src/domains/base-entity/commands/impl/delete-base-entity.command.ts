import { ICommand } from '@nestjs/cqrs';

export class DeleteBaseEntityCommand implements ICommand {
  constructor(public readonly id: string) {}
}