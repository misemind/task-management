import { ICommand } from '@nestjs/cqrs';
import { CreateProjectEmployeeDto } from '@app/domains/project-employee/dto/create-project-employee.dto';

export class CreateProjectEmployeeCommand implements ICommand {
  constructor(public readonly createProjectEmployeeDto: CreateProjectEmployeeDto) {}
}