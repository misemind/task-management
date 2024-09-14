import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProjectEmployeeCommand } from '@app/domains/project-employee/commands/impl/create-project-employee.command';
import { DeleteProjectEmployeeCommand } from '@app/domains/project-employee/commands/impl/delete-project-employee.command';
import { CreateProjectEmployeeDto } from '@app/domains/project-employee/dto/create-project-employee.dto';
import { ProjectEmployee } from '@app/domains/project-employee/entities/project-employee.entity';
import { GetProjectEmployeesByProjectQuery } from '@app/domains/project-employee/queries/impl/get-project-employees-by-project.query';
import { GetProjectsByEmployeeQuery } from '@app/domains/project-employee/queries/impl/get-projects-by-employee.query';
import { GetTotalProjectEmployeesCountQuery } from '@app/domains/project-employee/queries/impl/get-total-project-employees-count.query';
import { GetTotalEmployeeProjectsCountQuery } from '@app/domains/project-employee/queries/impl/get-total-employee-projects-count.query';

@Injectable()
export class ProjectEmployeeService {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus,) {}

  async createProjectEmployee(createProjectEmployeeDto: CreateProjectEmployeeDto): Promise<ProjectEmployee> {
    try {
      return await this.commandBus.execute(new CreateProjectEmployeeCommand(createProjectEmployeeDto));
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      console.error('Failed to create project-employee assignment', error);
      throw new InternalServerErrorException('Failed to create project-employee assignment');
    }
  }

  async findByProjectIdWithPagination(projectId: string, limit: number, skip: number) {
    try {
      // Fetch the paginated project-employee assignments
      const projectEmployees = await this.queryBus.execute(new GetProjectEmployeesByProjectQuery(projectId, limit, skip));
  
      // Fetch the total number of project-employee assignments
      const totalProjectEmployeesCount = await this.queryBus.execute(new GetTotalProjectEmployeesCountQuery(projectId));
  
      return {
        total: totalProjectEmployeesCount,
        projectEmployees,
      };
    } catch (error) {
      console.error('Failed to retrieve project employees', error);
      throw new InternalServerErrorException('Failed to retrieve project employees');
    }
  }
  
  async findByEmployeeIdWithPagination(employeeId: string, limit: number, skip: number) {
    try {
      // Fetch the paginated project-employee assignments
      const employeeProjects = await this.queryBus.execute(new GetProjectsByEmployeeQuery(employeeId, limit, skip));
  
      // Fetch the total number of employee-project assignments
      const totalEmployeeProjectsCount = await this.queryBus.execute(new GetTotalEmployeeProjectsCountQuery(employeeId));
  
      return {
        total: totalEmployeeProjectsCount,
        employeeProjects,
      };
    } catch (error) {
      console.error('Failed to retrieve employee projects', error);
      throw new InternalServerErrorException('Failed to retrieve employee projects');
    }
  }
  async deleteProjectEmployee(projectId: string, employeeId: string): Promise<ProjectEmployee | null> {
    try {
      return await this.commandBus.execute(new DeleteProjectEmployeeCommand(projectId, employeeId));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Failed to delete project-employee assignment', error);
      throw new InternalServerErrorException('Failed to delete project-employee assignment');
    }
  }
}
