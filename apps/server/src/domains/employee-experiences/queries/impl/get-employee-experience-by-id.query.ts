import { IQuery } from '@nestjs/cqrs';

export class GetEmployeeExperienceByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}
