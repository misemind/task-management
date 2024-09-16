import { ICommand } from "@nestjs/cqrs";

export class BulkCreateTaskCommand implements ICommand {
  constructor(public readonly fileBuffer: Buffer) {}
}