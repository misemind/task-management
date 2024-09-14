import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeRepository } from '@app/domains/employee/repositories/employee.repository';
import { MinioService } from '@app/infrastructure/cloud/minio/minio.service';
import { Logger } from '@app/core/common/logger/logger.service';
import { NotFoundException } from '@nestjs/common';
import { DeleteEmployeeHandler } from '../../commands/handlers/delete-employee.handler';
import { DeleteEmployeeCommand } from '../../commands/impl/delete-employee.command';

describe('DeleteEmployeeHandler', () => {
  let handler: DeleteEmployeeHandler;
  let employeeRepository: EmployeeRepository;
  let minioService: MinioService;
  let logger: Logger;

  const mockEmployee = { _id: 'some-id' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteEmployeeHandler,
        {
          provide: EmployeeRepository,
          useValue: {
            findById: jest.fn().mockResolvedValue(mockEmployee),
            delete: jest.fn().mockResolvedValue(mockEmployee),
          },
        },
        {
          provide: MinioService,
          useValue: {
            listObjects: jest.fn().mockResolvedValue(['file1', 'file2']),
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

    handler = module.get<DeleteEmployeeHandler>(DeleteEmployeeHandler);
    employeeRepository = module.get<EmployeeRepository>(EmployeeRepository);
    minioService = module.get<MinioService>(MinioService);
    logger = module.get<Logger>(Logger);
  });

  it('should delete employee successfully', async () => {
    const command = new DeleteEmployeeCommand('some-id');
    const result = await handler.execute(command);
    expect(result).toEqual(mockEmployee);
    expect(employeeRepository.findById).toHaveBeenCalledWith('some-id');
    expect(employeeRepository.delete).toHaveBeenCalledWith('some-id');
    expect(minioService.listObjects).toHaveBeenCalled();
    expect(logger.log).toHaveBeenCalled();
  });

  it('should throw NotFoundException if employee not found', async () => {
    jest.spyOn(employeeRepository, 'findById').mockResolvedValueOnce(null);
    const command = new DeleteEmployeeCommand('some-id');
    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });
});
