import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Logger } from '@app/core/common/logger/logger.service';
import { CreateEmployeeCommand } from '../../commands/impl/create-employee.command';
import { DeleteEmployeeCommand } from '../../commands/impl/delete-employee.command';
import { UpdateEmployeeCommand } from '../../commands/impl/update-employee.command';
import { GetTotalEmployeesCountQuery } from '../../queries/handlers/get-total-employees-count.query';
import { GetAllEmployeesQuery } from '../../queries/impl/get-all-employees.query';
import { GetEmployeeByIdQuery } from '../../queries/impl/get-employee-by-id.query';
import { EmployeeService } from '../../services/employee.service';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  const mockEmployee = { _id: 'some-id', firstName: 'John', lastName: 'Doe' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  it('should update an employee', async () => {
    const updateEmployeeDto = { firstName: 'John' };
    jest.spyOn(commandBus, 'execute').mockResolvedValueOnce(mockEmployee);
    const result = await service.updateEmployee('some-id', updateEmployeeDto);

    expect(result).toEqual(mockEmployee);
    expect(commandBus.execute).toHaveBeenCalledWith(new UpdateEmployeeCommand('some-id', updateEmployeeDto));
  });

  it('should delete an employee', async () => {
    jest.spyOn(commandBus, 'execute').mockResolvedValueOnce(mockEmployee);
    const result = await service.deleteEmployee('some-id');

    expect(result).toEqual(mockEmployee);
    expect(commandBus.execute).toHaveBeenCalledWith(new DeleteEmployeeCommand('some-id'));
  });

  it('should get an employee by id', async () => {
    jest.spyOn(queryBus, 'execute').mockResolvedValueOnce(mockEmployee);
    const result = await service.getEmployeeById('some-id');

    expect(result).toEqual(mockEmployee);
    expect(queryBus.execute).toHaveBeenCalledWith(new GetEmployeeByIdQuery('some-id'));
  });

  it('should get all employees', async () => {
    const employees = [mockEmployee];
    jest.spyOn(queryBus, 'execute').mockResolvedValueOnce(employees);
    jest.spyOn(queryBus, 'execute').mockResolvedValueOnce(1); // Total employees count
    const result = await service.getAllEmployees(10, 1);

    expect(result).toEqual({ total: 1, employees });
    expect(queryBus.execute).toHaveBeenCalledWith(new GetAllEmployeesQuery(10, 1));
    expect(queryBus.execute).toHaveBeenCalledWith(new GetTotalEmployeesCountQuery());
  });
});
