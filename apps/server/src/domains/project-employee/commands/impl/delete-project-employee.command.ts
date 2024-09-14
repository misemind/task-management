import { ICommand } from '@nestjs/cqrs';

export class DeleteProjectEmployeeCommand implements ICommand {
  constructor(
    public readonly projectId: string,
    public readonly employeeId: string,
  ) {}
}