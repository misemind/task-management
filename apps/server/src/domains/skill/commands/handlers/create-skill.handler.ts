import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateSkillCommand } from '@app/domains/skill/commands/impl/create-skill.command';
import { SkillRepository } from '@app/domains/skill/repositories/skill.repository';
import { Skill } from '@app/domains/skill/entities/skill.entity';

@CommandHandler(CreateSkillCommand)
export class CreateSkillHandler implements ICommandHandler<CreateSkillCommand> {
  constructor(private readonly skillRepository: SkillRepository) {}

  async execute(command: CreateSkillCommand): Promise<Skill> {
    const { createSkillDto } = command;
    return this.skillRepository.create(createSkillDto);
  }
}
