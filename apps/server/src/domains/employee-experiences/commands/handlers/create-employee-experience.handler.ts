import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmployeeExperienceRepository } from '@app/domains/employee-experiences/repositories/employee-experience.repository';
import { CreateEmployeeExperienceCommand } from '@app/domains/employee-experiences/commands/impl/create-employee-experience.command';
import { EmployeeExperience } from '@app/domains/employee-experiences/entities/employee-experience.entity';

@CommandHandler(CreateEmployeeExperienceCommand)
export class CreateEmployeeExperienceHandler
  implements ICommandHandler<CreateEmployeeExperienceCommand> {
  constructor(private readonly employeeExperienceRepository: EmployeeExperienceRepository) {}

  async execute(command: CreateEmployeeExperienceCommand): Promise<EmployeeExperience> {
    const { createEmployeeExperienceDto } = command;
    return this.employeeExperienceRepository.create(createEmployeeExperienceDto);
  }
}
