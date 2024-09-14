// apps/server/src/domains/employee-document/commands/impl/download-employee-document.command.ts
import { ICommand } from '@nestjs/cqrs';

export class DownloadEmployeeDocumentCommand implements ICommand {
  constructor(public readonly id: string) {}
}
