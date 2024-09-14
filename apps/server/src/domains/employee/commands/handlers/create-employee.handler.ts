import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmployeeRepository } from '@app/domains/employee/repositories/employee.repository';
import { Employee } from '@app/domains/employee/entities/employee.entity';
import { CreateEmployeeCommand } from '@app/domains/employee/commands/impl/create-employee.command';
import { MinioService } from '@app/infrastructure/cloud/minio/minio.service';
import { Inject, Injectable } from '@nestjs/common';
import { StorageConfig } from '@app/core/common/interfaces/storage-config.interface';
import { Logger } from '@app/core/common/logger/logger.service';


@CommandHandler(CreateEmployeeCommand)
@Injectable()
export class CreateEmployeeHandler implements ICommandHandler<CreateEmployeeCommand> {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly minioService: MinioService,
    @Inject('STORAGE_CONFIG') private readonly config: StorageConfig,
    private readonly logger: Logger, // Inject Logger
  ) {}

  async execute(command: CreateEmployeeCommand): Promise<Employee> {
    this.logger.log(`Creating a new employee with data: ${JSON.stringify(command.createEmployeeDto)}`);

    const { profileImagePath, coverImagePath } = command.createEmployeeDto;

    // Create the employee in the database
    const createdEmployee = await this.employeeRepository.create(command.createEmployeeDto);

    // Handle profile image
    if (profileImagePath) {
      const profileDestinationPath = `${this.config.destinationEntityFolder}/${createdEmployee._id}/profile/${this.extractFileName(profileImagePath)}`;
      await this.minioService.moveFile(this.config.sourceBucket, this.config.destinationBucket, profileImagePath, profileDestinationPath);
      createdEmployee.profileImagePath = `${this.config.destinationBucket}/${profileDestinationPath}`;
      this.logger.log(`Profile image moved to: ${profileDestinationPath}`);
    }

    // Handle cover image
    if (coverImagePath) {
      const coverDestinationPath = `${this.config.destinationEntityFolder}/${createdEmployee._id}/cover/${this.extractFileName(coverImagePath)}`;
      await this.minioService.moveFile(this.config.sourceBucket, this.config.destinationBucket, coverImagePath, coverDestinationPath);
      createdEmployee.coverImagePath = `${this.config.destinationBucket}/${coverDestinationPath}`;
      this.logger.log(`Cover image moved to: ${coverDestinationPath}`);
    }

    const updatedEmployee = await this.employeeRepository.update(createdEmployee._id, createdEmployee);
    this.logger.log(`Employee created successfully with ID: ${createdEmployee._id}`);
    
    return updatedEmployee;
  }

  private extractFileName(filePath: string): string {
    return filePath.split('/').pop();
  }
}
