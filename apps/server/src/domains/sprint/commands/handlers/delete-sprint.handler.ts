import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SprintRepository } from '@app/domains/sprint/repositories/sprint.repository';
import { DeleteSprintCommand } from '@app/domains/sprint/commands/impl/delete-sprint.command';
import { Sprint } from '@app/domains/sprint/entities/sprint.entity';

@CommandHandler(DeleteSprintCommand)
export class DeleteSprintHandler implements ICommandHandler<DeleteSprintCommand> {
  constructor(private readonly sprintRepository: SprintRepository) {}

  async execute(command: DeleteSprintCommand): Promise<Sprint | null> {
    const { id } = command;
    return this.sprintRepository.delete(id);
  }
}