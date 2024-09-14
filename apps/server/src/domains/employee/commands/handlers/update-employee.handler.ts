import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmployeeRepository } from '@app/domains/employee/repositories/employee.repository';
import { UpdateEmployeeCommand } from '@app/domains/employee/commands/impl/update-employee.command';
import { Employee } from '@app/domains/employee/entities/employee.entity';
import { Inject, NotFoundException, Injectable } from '@nestjs/common';
import { MinioService } from '@app/infrastructure/cloud/minio/minio.service';
import { StorageConfig } from '@app/core/common/interfaces/storage-config.interface';
import { Logger } from '@app/core/common/logger/logger.service';


@CommandHandler(UpdateEmployeeCommand)
@Injectable()
export class UpdateEmployeeHandler implements ICommandHandler<UpdateEmployeeCommand> {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly minioService: MinioService,
    @Inject('STORAGE_CONFIG') private readonly config: StorageConfig,
    private readonly logger: Logger, // Inject Logger
  ) {}

  async execute(command: UpdateEmployeeCommand): Promise<Employee | null> {
    this.logger.log(`Updating employee with ID: ${command.id}`);

    const existingEmployee = await this.employeeRepository.findById(command.id);

    if (!existingEmployee) {
      this.logger.warn(`Employee not found with ID: ${command.id}`);
      throw new NotFoundException('Employee not found');
    }

    const updateData = { ...existingEmployee, ...command.updateEmployeeDto };

    // Handle profile image update
    if (command.updateEmployeeDto.profileImagePath && command.updateEmployeeDto.profileImagePath !== existingEmployee.profileImagePath) {
      const profileDestinationPath = `${this.config.destinationEntityFolder}/${existingEmployee._id}/profile/${this.extractFileName(command.updateEmployeeDto.profileImagePath)}`;

      if (existingEmployee.profileImagePath) {
        const objectPath = this.extractObjectPath(existingEmployee.profileImagePath);
        await this.minioService.deleteFile(this.config.destinationBucket, objectPath);
        this.logger.log(`Deleted old profile image: ${objectPath}`);
      }

      await this.minioService.moveFile(this.config.sourceBucket, this.config.destinationBucket, command.updateEmployeeDto.profileImagePath, profileDestinationPath);
      updateData.profileImagePath = `${this.config.destinationBucket}/${profileDestinationPath}`;
      this.logger.log(`Profile image updated and moved to: ${profileDestinationPath}`);
    }

    // Handle cover image update
    if (command.updateEmployeeDto.coverImagePath && command.updateEmployeeDto.coverImagePath !== existingEmployee.coverImagePath) {
      const coverDestinationPath = `${this.config.destinationEntityFolder}/${existingEmployee._id}/cover/${this.extractFileName(command.updateEmployeeDto.coverImagePath)}`;

      if (existingEmployee.coverImagePath) {
        const objectPath = this.extractObjectPath(existingEmployee.coverImagePath);
        await this.minioService.deleteFile(this.config.destinationBucket, objectPath);
        this.logger.log(`Deleted old cover image: ${objectPath}`);
      }

      await this.minioService.moveFile(this.config.sourceBucket, this.config.destinationBucket, command.updateEmployeeDto.coverImagePath, coverDestinationPath);
      updateData.coverImagePath = `${this.config.destinationBucket}/${coverDestinationPath}`;
      this.logger.log(`Cover image updated and moved to: ${coverDestinationPath}`);
    }

    const updatedEmployee = await this.employeeRepository.update(existingEmployee._id, updateData);
    this.logger.log(`Employee updated successfully with ID: ${existingEmployee._id}`);

    return updatedEmployee;
  }

  private extractFileName(filePath: string): string {
    return filePath.split('/').pop();
  }

  private extractObjectPath(fullPath: string): string {
    const pathParts = fullPath.split('/');
    pathParts.shift(); // Remove the bucket name
    return pathParts.join('/');
  }
}
