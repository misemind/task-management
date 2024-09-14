import { ICommand } from '@nestjs/cqrs';
import { CreateEmployeeDto } from '@app/domains/employee/dto/create-employee.dto';

export class CreateEmployeeCommand implements ICommand {
  constructor(public readonly createEmployeeDto: CreateEmployeeDto) {}
}
