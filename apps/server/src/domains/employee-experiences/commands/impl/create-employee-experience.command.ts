import { ICommand } from '@nestjs/cqrs';
import { CreateEmployeeExperienceDto } from '@app/domains/employee-experiences/dto/create-employee-experience.dto';

export class CreateEmployeeExperienceCommand implements ICommand {
  constructor(public readonly createEmployeeExperienceDto: CreateEmployeeExperienceDto) {}
}
