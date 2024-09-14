import { ICommand } from '@nestjs/cqrs';
import { CreateProjectDto } from '@app/domains/project/dto/create-project.dto';

export class CreateProjectCommand implements ICommand {
  constructor(public readonly createProjectDto: CreateProjectDto) {}
}
