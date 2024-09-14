import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeRepository } from '@app/domains/employee/repositories/employee.repository';
import { MinioService } from '@app/infrastructure/cloud/minio/minio.service';
import { Employee } from '@app/domains/employee/entities/employee.entity';
import { Logger } from '@app/core/common/logger/logger.service';
import { NotFoundException } from '@nestjs/common';
import { UpdateEmployeeHandler } from '../../commands/handlers/update-employee.handler';
import { UpdateEmployeeCommand } from '../../commands/impl/update-employee.command';

describe('UpdateEmployeeHandler', () => {
  let handler: UpdateEmployeeHandler;
  let employeeRepository: EmployeeRepository;
  let minioService: MinioService;
  let logger: Logger;

  const mockEmployee = {
    _id: 'some-id',
    profileImagePath: 'old-path',
    coverImagePath: 'old-cover-path',
  } as Employee;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateEmployeeHandler,
        {
          provide: EmployeeRepository,
          useValue: {
            findById: jest.fn().mockResolvedValue(mockEmployee),
            update: jest.fn().mockResolvedValue(mockEmployee),
          },
        },
        {
          provide: MinioService,
          useValue: {
            moveFile: jest.fn().mockResolvedValue(true),
            deleteFile: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            warn: jest.fn(),
          },
        },
        {
          provide: 'STORAGE_CONFIG',
          useValue: { destinationEntityFolder: 'employees', destinationBucket: 'bucket' },
        },
      ],
    }).compile();

    handler = module.get<UpdateEmployeeHandler>(UpdateEmployeeHandler);
    employeeRepository = module.get<EmployeeRepository>(EmployeeRepository);
    minioService = module.get<MinioService>(MinioService);
    logger = module.get<Logger>(Logger);
  });

  it('should update an employee successfully', async () => {
    const command = new UpdateEmployeeCommand('some-id', { profileImagePath: 'new-path', coverImagePath: 'new-cover-path' });
    const result = await handler.execute(command);
    expect(result).toEqual(mockEmployee);
    expect(employeeRepository.findById).toHaveBeenCalledWith('some-id');
    expect(employeeRepository.update).toHaveBeenCalledWith('some-id', expect.anything());
    expect(minioService.moveFile).toHaveBeenCalled();
    expect(logger.log).toHaveBeenCalled();
  });

  it('should throw NotFoundException if employee not found', async () => {
    jest.spyOn(employeeRepository, 'findById').mockResolvedValueOnce(null);
    const command = new UpdateEmployeeCommand('some-id', { profileImagePath: 'new-path' });
    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });
});
