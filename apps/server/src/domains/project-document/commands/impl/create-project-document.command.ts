import { ICommand } from '@nestjs/cqrs';
import { CreateProjectDocumentDto } from '@app/domains/project-document/dto/create-project-document.dto';

export class CreateProjectDocumentCommand implements ICommand {
  constructor(public readonly createProjectDocumentDto: CreateProjectDocumentDto) { }
}