import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EmployeeExperienceRepository } from '@app/domains/employee-experiences/repositories/employee-experience.repository';
import { GetEmployeeExperienceByIdQuery } from '@app/domains/employee-experiences/queries/impl/get-employee-experience-by-id.query';
import { EmployeeExperience } from '@app/domains/employee-experiences/entities/employee-experience.entity';

@QueryHandler(GetEmployeeExperienceByIdQuery)
export class GetEmployeeExperienceByIdHandler
  implements IQueryHandler<GetEmployeeExperienceByIdQuery> {
  constructor(private readonly employeeExperienceRepository: EmployeeExperienceRepository) {}

  async execute(query: GetEmployeeExperienceByIdQuery): Promise<EmployeeExperience | null> {
    return this.employeeExperienceRepository.findById(query.id);
  }
}
