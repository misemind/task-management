import { ICommand } from '@nestjs/cqrs';
import { UpdateProjectDocumentDto } from '@app/domains/project-document/dto/update-project-document.dto';

export class UpdateProjectDocumentCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly updateProjectDocumentDto: UpdateProjectDocumentDto,
  ) { }
}