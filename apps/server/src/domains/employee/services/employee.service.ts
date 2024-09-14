import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateEmployeeCommand } from '@app/domains/employee/commands/impl/create-employee.command';
import { DeleteEmployeeCommand } from '@app/domains/employee/commands/impl/delete-employee.command';
import { UpdateEmployeeCommand } from '@app/domains/employee/commands/impl/update-employee.command';
import { CreateEmployeeDto } from '@app/domains/employee/dto/create-employee.dto';
import { UpdateEmployeeDto } from '@app/domains/employee/dto/update-employee.dto';
import { GetAllEmployeesQuery } from '@app/domains/employee/queries/impl/get-all-employees.query';
import { GetEmployeeByIdQuery } from '@app/domains/employee/queries/impl/get-employee-by-id.query';
import { Logger } from '@app/core/common/logger/logger.service';
import { GetTotalEmployeesCountQuery } from '@app/domains/employee/queries/handlers/get-total-employees-count.query';


@Injectable()
export class EmployeeService {
  constructor(
    private commandBus: CommandBus, 
    private queryBus: QueryBus,
    private readonly logger: Logger, // Inject Logger
  ) {}

  async createEmployee(createEmployeeDto: CreateEmployeeDto) {
    try {
      this.logger.log(`Creating employee with data: ${JSON.stringify(createEmployeeDto)}`);
      const employee = await this.commandBus.execute(new CreateEmployeeCommand(createEmployeeDto));
      this.logger.log(`Employee created with ID: ${employee._id}`);
      return employee;
    } catch (error) {
      this.logger.error('Failed to create employee', error.stack);
      throw new InternalServerErrorException('Failed to create employee', error);
    }
  }

  async updateEmployee(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    try {
      this.logger.log(`Updating employee with ID: ${id} and data: ${JSON.stringify(updateEmployeeDto)}`);
      const employee = await this.commandBus.execute(new UpdateEmployeeCommand(id, updateEmployeeDto));
      if (!employee) {
        this.logger.warn(`Employee not found with ID: ${id}`);
        throw new NotFoundException('Employee not found');
      }
      this.logger.log(`Employee updated successfully with ID: ${id}`);
      return employee;
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Failed to update employee: ${error.message}`);
        throw error;
      }
      this.logger.error('Failed to update employee', error.stack);
      throw new InternalServerErrorException('Failed to update employee', error);
    }
  }

  async deleteEmployee(id: string) {
    try {
      this.logger.log(`Deleting employee with ID: ${id}`);
      const employee = await this.commandBus.execute(new DeleteEmployeeCommand(id));
      if (!employee) {
        this.logger.warn(`Employee not found with ID: ${id}`);
        throw new NotFoundException('Employee not found');
      }
      this.logger.log(`Employee deleted successfully with ID: ${id}`);
      return employee;
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Failed to delete employee: ${error.message}`);
        throw error;
      }
      this.logger.error('Failed to delete employee', error.stack);
      throw new InternalServerErrorException('Failed to delete employee', error);
    }
  }

  async getEmployeeById(id: string) {
    try {
      this.logger.log(`Retrieving employee with ID: ${id}`);
      const employee = await this.queryBus.execute(new GetEmployeeByIdQuery(id));
      if (!employee) {
        this.logger.warn(`Employee not found with ID: ${id}`);
        throw new NotFoundException('Employee not found');
      }
      this.logger.log(`Employee retrieved with ID: ${id}`);
      return employee;
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Failed to retrieve employee: ${error.message}`);
        throw error;
      }
      this.logger.error('Failed to retrieve employee', error.stack);
      throw new InternalServerErrorException('Failed to retrieve employee', error);
    }
  }

  async getAllEmployees(limit = 10, page = 1) {
    try {
      this.logger.log(`Retrieving all employees with limit: ${limit}, page: ${page}`);
  
      // Fetch the paginated employees
      const employees = await this.queryBus.execute(new GetAllEmployeesQuery(limit, page));
  
      // Fetch the total number of employees
      const totalEmployeesCount = await this.queryBus.execute(new GetTotalEmployeesCountQuery());
  
      this.logger.log(`Retrieved ${employees.length} employees out of ${totalEmployeesCount} total`);
  
      // Return the employees along with the total count
      return {
        total: totalEmployeesCount,
        employees,
      };
    } catch (error) {
      this.logger.error('Failed to retrieve employees', error.stack);
      throw new InternalServerErrorException('Failed to retrieve employees', error);
    }
  }
}
