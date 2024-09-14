import { ICommand } from '@nestjs/cqrs';

export class DeleteBoardCommand implements ICommand {
  constructor(public readonly id: string) {}
}