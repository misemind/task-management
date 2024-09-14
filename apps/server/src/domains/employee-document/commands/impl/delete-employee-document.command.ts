import { ICommand } from '@nestjs/cqrs';

export class DeleteEmployeeDocumentCommand implements ICommand {
  constructor(public readonly id: string) {}
}