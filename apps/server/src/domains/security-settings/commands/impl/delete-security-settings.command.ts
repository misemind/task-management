import { ICommand } from '@nestjs/cqrs';

export class DeleteSecuritySettingsCommand implements ICommand {
  constructor(public readonly id: string) {}
}