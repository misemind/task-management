import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SprintRepository } from '@app/domains/sprint/repositories/sprint.repository';
import { UpdateSprintCommand } from '@app/domains/sprint/commands/impl/update-sprint.command';
import { Sprint } from '@app/domains/sprint/entities/sprint.entity';
import { NotFoundException, Injectable } from '@nestjs/common';

@CommandHandler(UpdateSprintCommand)
@Injectable()
export class UpdateSprintHandler implements ICommandHandler<UpdateSprintCommand> {
  constructor(private readonly sprintRepository: SprintRepository) {}

  async execute(command: UpdateSprintCommand): Promise<Sprint | null> {
    const existingSprint = await this.sprintRepository.findById(command.id);

    if (!existingSprint) {
      throw new NotFoundException('Sprint not found');
    }

    const updatedSprint = await this.sprintRepository.update(command.id, command.updateSprintDto);
    return updatedSprint;
  }
}