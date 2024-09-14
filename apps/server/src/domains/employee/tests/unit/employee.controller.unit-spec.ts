import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from '../../controllers/employee.controller';
import { CreateEmployeeDto } from '../../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../../dto/update-employee.dto';
import { EmployeeService } from '../../services/employee.service';

describe('EmployeeController', () => {
  let controller: EmployeeController;
  let employeeService: EmployeeService;

  const mockEmployee = {
    _id: 'some-id',
    firstName: 'John',
    lastName: 'Doe',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [
        {
          provide: EmployeeService,
          useValue: {
            createEmployee: jest.fn().mockResolvedValue(mockEmployee),
            getAllEmployees: jest.fn().mockResolvedValue({ total: 1, employees: [mockEmployee] }),
            getEmployeeById: jest.fn().mockResolvedValue(mockEmployee),
            updateEmployee: jest.fn().mockResolvedValue(mockEmployee),
            deleteEmployee: jest.fn().mockResolvedValue(mockEmployee),
          },
        },
      ],
    }).compile();

    controller = module.get<EmployeeController>(EmployeeController);
    employeeService = module.get<EmployeeService>(EmployeeService);
  });

  it('should create an employee', async () => {
    const createEmployeeDto: CreateEmployeeDto = {
        ...mockEmployee, designation: 'Developer',
        phoneNumber: '',
        emailAddress: '',
        skills: [],
        passwordHash: '',
        projectNumber: 0,
        taskNumber: 0,
        profileImagePath: '',
        coverImagePath: ''
    };
    const result = await controller.create(createEmployeeDto);

    expect(result).toEqual(mockEmployee);
    expect(employeeService.createEmployee).toHaveBeenCalledWith(createEmployeeDto);
  });

  it('should get all employees', async () => {
    const result = await controller.findAll({ limit: 10, page: 1 });

    expect(result).toEqual({ total: 1, employees: [mockEmployee] });
    expect(employeeService.getAllEmployees).toHaveBeenCalledWith(10, 1);
  });

  it('should get an employee by id', async () => {
    const result = await controller.findOne('some-id');

    expect(result).toEqual(mockEmployee);
    expect(employeeService.getEmployeeById).toHaveBeenCalledWith('some-id');
  });

  it('should update an employee', async () => {
    const updateEmployeeDto: UpdateEmployeeDto = { ...mockEmployee };
    const result = await controller.update('some-id', updateEmployeeDto);

    expect(result).toEqual(mockEmployee);
    expect(employeeService.updateEmployee).toHaveBeenCalledWith('some-id', updateEmployeeDto);
  });

  it('should delete an employee', async () => {
    const result = await controller.remove('some-id');

    expect(result).toEqual(mockEmployee);
    expect(employeeService.deleteEmployee).toHaveBeenCalledWith('some-id');
  });
});
