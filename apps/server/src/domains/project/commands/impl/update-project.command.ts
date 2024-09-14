import { ICommand } from '@nestjs/cqrs';
import { UpdateProjectDto } from '@app/domains/project/dto/update-project.dto';

export class UpdateProjectCommand implements ICommand {
  constructor(public readonly id: string, public readonly updateProjectDto: UpdateProjectDto) {}
}
