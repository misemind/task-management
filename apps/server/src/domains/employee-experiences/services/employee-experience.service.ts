import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateEmployeeExperienceCommand } from '@app/domains/employee-experiences/commands/impl/create-employee-experience.command';
import { UpdateEmployeeExperienceCommand } from '@app/domains/employee-experiences/commands/impl/update-employee-experience.command';
import { DeleteEmployeeExperienceCommand } from '@app/domains/employee-experiences/commands/impl/delete-employee-experience.command';
import { GetEmployeeExperiencesQuery } from '@app/domains/employee-experiences/queries/impl/get-employee-experiences.query';
import { GetEmployeeExperienceByIdQuery } from '@app/domains/employee-experiences/queries/impl/get-employee-experience-by-id.query';
import { CreateEmployeeExperienceDto } from '@app/domains/employee-experiences/dto/create-employee-experience.dto';
import { UpdateEmployeeExperienceDto } from '@app/domains/employee-experiences/dto/update-employee-experience.dto';

@Injectable()
export class EmployeeExperienceService {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  async createExperience(createEmployeeExperienceDto: CreateEmployeeExperienceDto) {
    try {
      return await this.commandBus.execute(new CreateEmployeeExperienceCommand(createEmployeeExperienceDto));
    } catch (error) {
        console.log('Error in EmployeeExperience',error);
      throw new InternalServerErrorException('Failed to create experience');
    }
  }

  async updateExperience(id: string, updateEmployeeExperienceDto: UpdateEmployeeExperienceDto) {
    try {
      const experience = await this.commandBus.execute(new UpdateEmployeeExperienceCommand(id, updateEmployeeExperienceDto));
      if (!experience) {
        throw new NotFoundException('Experience not found');
      }
      return experience;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.log('Error in EmployeeExperience',error);
      throw new InternalServerErrorException('Failed to update experience');
    }
  }

  async deleteExperience(id: string) {
    try {
      const experience = await this.commandBus.execute(new DeleteEmployeeExperienceCommand(id));
      if (!experience) {
        throw new NotFoundException('Experience not found');
      }
      return experience;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.log('Error in EmployeeExperience',error);
      throw new InternalServerErrorException('Failed to delete experience');
    }
  }

  async getExperienceById(id: string) {
    try {
      const experience = await this.queryBus.execute(new GetEmployeeExperienceByIdQuery(id));
      if (!experience) {
        throw new NotFoundException('Experience not found');
      }
      return experience;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.log('Error in EmployeeExperience',error);
      throw new InternalServerErrorException('Failed to retrieve experience');
    }
  }

  async getExperiencesByEmployeeId(employee_id: string) {
    try {
      return await this.queryBus.execute(new GetEmployeeExperiencesQuery(employee_id));
    } catch (error) {
        console.log('Error in EmployeeExperience',error);
      throw new InternalServerErrorException('Failed to retrieve experiences');
    }
  }
}
