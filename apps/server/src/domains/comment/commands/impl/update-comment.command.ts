import { ICommand } from '@nestjs/cqrs';

export class UpdateCommentCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly content: string,
  ) { }
}