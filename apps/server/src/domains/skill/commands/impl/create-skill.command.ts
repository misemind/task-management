import { ICommand } from '@nestjs/cqrs';
import { CreateSkillDto } from '@app/domains/skill/dto/create-skill.dto';

export class CreateSkillCommand implements ICommand {
  constructor(public readonly createSkillDto: CreateSkillDto) {}
}
