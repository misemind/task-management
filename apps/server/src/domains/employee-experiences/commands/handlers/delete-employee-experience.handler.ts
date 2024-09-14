import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmployeeExperienceRepository } from '@app/domains/employee-experiences/repositories/employee-experience.repository';
import { DeleteEmployeeExperienceCommand } from '@app/domains/employee-experiences/commands/impl/delete-employee-experience.command';
import { EmployeeExperience } from '@app/domains/employee-experiences/entities/employee-experience.entity';

@CommandHandler(DeleteEmployeeExperienceCommand)
export class DeleteEmployeeExperienceHandler
  implements ICommandHandler<DeleteEmployeeExperienceCommand> {
  constructor(private readonly employeeExperienceRepository: EmployeeExperienceRepository) {}

  async execute(command: DeleteEmployeeExperienceCommand): Promise<EmployeeExperience | null> {
    const { id } = command;
    return this.employeeExperienceRepository.delete(id);
  }
}
