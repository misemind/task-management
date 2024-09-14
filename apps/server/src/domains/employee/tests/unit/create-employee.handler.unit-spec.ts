import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeRepository } from '@app/domains/employee/repositories/employee.repository';
import { MinioService } from '@app/infrastructure/cloud/minio/minio.service';
import { Logger } from '@app/core/common/logger/logger.service';
import { Employee } from '@app/domains/employee/entities/employee.entity';
import { CreateEmployeeDto } from '@app/domains/employee/dto/create-employee.dto';
import { CreateEmployeeHandler } from '../../commands/handlers/create-employee.handler';
import { CreateEmployeeCommand } from '../../commands/impl/create-employee.command';

describe('CreateEmployeeHandler', () => {
  let handler: CreateEmployeeHandler;
  let employeeRepository: EmployeeRepository;
  let minioService: MinioService;
  let logger: Logger;

  const mockEmployee = {
    _id: 'some-id',
    firstName: 'John',
    lastName: 'Doe',
    profileImagePath: 'new-profile-path',
    coverImagePath: 'new-cover-path'
  } as Employee;

  const mockCreateEmployeeDto: CreateEmployeeDto = {
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '1234567890',
    emailAddress: 'john.doe@example.com',
    joiningDate: new Date(),
    skills: ['JavaScript', 'Node.js'],
    designation: 'Software Engineer',
    website: 'https://example.com',
    city: 'New York',
    country: 'USA',
    zipCode: '10001',
    description: 'A skilled software engineer',
    profileCompletion: 90,
    socialLinks: ['https://linkedin.com/john-doe'],
    passwordHash: 'hashed-password',
    projectNumber: 5,
    taskNumber: 10,
    profileImagePath: 'old-profile-path',
    coverImagePath: 'old-cover-path'
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateEmployeeHandler,
        {
          provide: EmployeeRepository,
          useValue: {
            create: jest.fn().mockResolvedValue(mockEmployee),
            update: jest.fn().mockResolvedValue(mockEmployee),
          },
        },
        {
          provide: MinioService,
          useValue: {
            moveFile: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: 'STORAGE_CONFIG',
          useValue: { destinationEntityFolder: 'employees', destinationBucket: 'bucket' },
        },
      ],
    }).compile();

    handler = module.get<CreateEmployeeHandler>(CreateEmployeeHandler);
    employeeRepository = module.get<EmployeeRepository>(EmployeeRepository);
    minioService = module.get<MinioService>(MinioService);
    logger = module.get<Logger>(Logger);
  });

  it('should create an employee successfully', async () => {
    const command = new CreateEmployeeCommand(mockCreateEmployeeDto);
    const result = await handler.execute(command);
    expect(result).toEqual(mockEmployee);
    expect(employeeRepository.create).toHaveBeenCalledWith(mockCreateEmployeeDto);
    expect(minioService.moveFile).toHaveBeenCalled();
    expect(employeeRepository.update).toHaveBeenCalledWith(mockEmployee._id, mockEmployee);
    expect(logger.log).toHaveBeenCalled();
  });
});
