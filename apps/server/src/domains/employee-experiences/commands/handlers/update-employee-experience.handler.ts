import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmployeeExperienceRepository } from '@app/domains/employee-experiences/repositories/employee-experience.repository';
import { UpdateEmployeeExperienceCommand } from '@app/domains/employee-experiences/commands/impl/update-employee-experience.command';
import { EmployeeExperience } from '@app/domains/employee-experiences/entities/employee-experience.entity';

@CommandHandler(UpdateEmployeeExperienceCommand)
export class UpdateEmployeeExperienceHandler
  implements ICommandHandler<UpdateEmployeeExperienceCommand> {
  constructor(private readonly employeeExperienceRepository: EmployeeExperienceRepository) {}

  async execute(command: UpdateEmployeeExperienceCommand): Promise<EmployeeExperience | null> {
    const { id, updateEmployeeExperienceDto } = command;
    return this.employeeExperienceRepository.update(id, updateEmployeeExperienceDto);
  }
}
