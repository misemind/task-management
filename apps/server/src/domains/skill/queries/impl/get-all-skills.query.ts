import { IQuery } from '@nestjs/cqrs';

export class GetAllSkillsQuery implements IQuery {
  constructor(public readonly limit: number, public readonly page: number) {}
}
