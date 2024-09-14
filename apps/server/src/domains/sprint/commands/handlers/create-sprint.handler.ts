import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SprintRepository } from '@app/domains/sprint/repositories/sprint.repository';
import { CreateSprintCommand } from '@app/domains/sprint/commands/impl/create-sprint.command';
import { Sprint } from '@app/domains/sprint/entities/sprint.entity';
import { Injectable } from '@nestjs/common';

@CommandHandler(CreateSprintCommand)
@Injectable()
export class CreateSprintHandler implements ICommandHandler<CreateSprintCommand> {
  constructor(private readonly sprintRepository: SprintRepository) {}

  async execute(command: CreateSprintCommand): Promise<Sprint> {
    const { createSprintDto } = command;
    const createdSprint = await this.sprintRepository.create(createSprintDto);
    return createdSprint;
  }
}