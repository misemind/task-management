import { ICommand } from '@nestjs/cqrs';

export class DownloadProjectDocumentCommand implements ICommand {
  constructor(public readonly id: string) {}
}