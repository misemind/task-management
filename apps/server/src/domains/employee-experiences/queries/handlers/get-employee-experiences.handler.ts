import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EmployeeExperienceRepository } from '@app/domains/employee-experiences/repositories/employee-experience.repository';
import { GetEmployeeExperiencesQuery } from '@app/domains/employee-experiences/queries/impl/get-employee-experiences.query';
import { EmployeeExperience } from '@app/domains/employee-experiences/entities/employee-experience.entity';

@QueryHandler(GetEmployeeExperiencesQuery)
export class GetEmployeeExperiencesHandler implements IQueryHandler<GetEmployeeExperiencesQuery> {
  constructor(private readonly employeeExperienceRepository: EmployeeExperienceRepository) {}

  async execute(query: GetEmployeeExperiencesQuery): Promise<EmployeeExperience[]> {
    return this.employeeExperienceRepository.findByEmployeeId(query.employee_id);
  }
}
