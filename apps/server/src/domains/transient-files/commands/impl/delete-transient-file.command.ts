import { ICommand } from '@nestjs/cqrs';

export class DeleteTransientFileCommand implements ICommand {
  constructor(public readonly id: string) {}
}
