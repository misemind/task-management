import { ICommand } from '@nestjs/cqrs';

export class DeleteProjectDocumentCommand implements ICommand {
  constructor(public readonly id: string) {}
}