import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmployeeDocumentRepository } from '@app/domains/employee-document/repositories/employee-document.repository';
import { UpdateEmployeeDocumentCommand } from '@app/domains/employee-document/commands/impl/update-employee-document.command';
import { EmployeeDocument } from '@app/domains/employee-document/entities/employee-document.entity';


@CommandHandler(UpdateEmployeeDocumentCommand)
export class UpdateEmployeeDocumentHandler implements ICommandHandler<UpdateEmployeeDocumentCommand> {
  constructor(private readonly employeeDocumentRepository: EmployeeDocumentRepository) {}

  async execute(command: UpdateEmployeeDocumentCommand): Promise<EmployeeDocument | null> {
    return this.employeeDocumentRepository.update(command.id, command.updateEmployeeDocumentDto);
  }
}