import { ICommand } from '@nestjs/cqrs';
import { UpdateEmployeeDocumentDto } from '@app/domains/employee-document/dto/update-employee-document.dto';

export class UpdateEmployeeDocumentCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly updateEmployeeDocumentDto: UpdateEmployeeDocumentDto,
  ) {}
}