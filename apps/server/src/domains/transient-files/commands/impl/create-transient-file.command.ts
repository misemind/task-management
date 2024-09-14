import { ICommand } from '@nestjs/cqrs';

export class CreateTransientFileCommand implements ICommand {
  constructor(
    public readonly filePath: string,
    public readonly expiresAt: Date,
  ) {}
}
