import { ICommand } from '@nestjs/cqrs';
import { UpdateEmployeeExperienceDto } from '@app/domains/employee-experiences/dto/update-employee-experience.dto';

export class UpdateEmployeeExperienceCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly updateEmployeeExperienceDto: UpdateEmployeeExperienceDto,
  ) {}
}
