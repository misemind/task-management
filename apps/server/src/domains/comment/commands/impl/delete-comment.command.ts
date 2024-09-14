import { ICommand } from '@nestjs/cqrs';

export class DeleteCommentCommand implements ICommand {
  constructor(public readonly id: string) {}
}