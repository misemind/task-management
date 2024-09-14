import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateSkillDto } from '@app/domains/skill/dto/create-skill.dto';
import { CreateSkillCommand } from '@app/domains/skill/commands/impl/create-skill.command';
import { GetAllSkillsQuery } from '@app/domains/skill/queries/impl/get-all-skills.query';


@Injectable()
export class SkillService {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  async create(createSkillDto: CreateSkillDto) {
    try {
      return await this.commandBus.execute(new CreateSkillCommand(createSkillDto));
    } catch (error) {
      console.log('SkillService create',error);
      throw new InternalServerErrorException('Failed to create project');
    }
  }

  async getSkills(limit = 1000, page = 1) {
    try {
      return await this.queryBus.execute(new GetAllSkillsQuery(limit, page));
    } catch (error) {
      console.log('SkillService getSkills',error);
      throw new InternalServerErrorException('Failed to retrieve projects');
    }
  }
}
