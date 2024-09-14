import { ICommand } from '@nestjs/cqrs';
import { CreateEmployeeDocumentDto } from '@app/domains/employee-document/dto/create-employee-document.dto';

export class CreateEmployeeDocumentCommand implements ICommand {
  constructor(public readonly createEmployeeDocumentDto: CreateEmployeeDocumentDto) {}
}