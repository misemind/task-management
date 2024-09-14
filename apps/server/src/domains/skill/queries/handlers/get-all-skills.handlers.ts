import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllSkillsQuery } from '@app/domains/skill/queries/impl/get-all-skills.query';
import { SkillRepository } from '@app/domains/skill/repositories/skill.repository';
import { Skill } from '@app/domains/skill/entities/skill.entity';

@QueryHandler(GetAllSkillsQuery)
export class GetAllskillsHandler implements IQueryHandler<GetAllSkillsQuery> {
  constructor(private readonly skillRepository: SkillRepository) {}

  async execute(query: GetAllSkillsQuery): Promise<Skill[]> {
    const { limit, page } = query;
    const skip = (page - 1) * limit;
    return this.skillRepository.findAll(limit, skip);
  }
}
