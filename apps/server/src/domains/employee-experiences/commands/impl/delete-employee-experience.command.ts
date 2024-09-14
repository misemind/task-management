import { ICommand } from '@nestjs/cqrs';

export class DeleteEmployeeExperienceCommand implements ICommand {
  constructor(public readonly id: string) {}
}
