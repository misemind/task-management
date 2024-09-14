import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmployeeRepository } from '@app/domains/employee/repositories/employee.repository';
import { DeleteEmployeeCommand } from '@app/domains/employee/commands/impl/delete-employee.command';
import { Employee } from '@app/domains/employee/entities/employee.entity';
import { NotFoundException, Inject, Injectable } from '@nestjs/common';
import { MinioService } from '@app/infrastructure/cloud/minio/minio.service';
import { StorageConfig } from '@app/core/common/interfaces/storage-config.interface';
import { Logger } from '@app/core/common/logger/logger.service';


@CommandHandler(DeleteEmployeeCommand)
@Injectable()
export class DeleteEmployeeHandler implements ICommandHandler<DeleteEmployeeCommand> {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly minioService: MinioService,
    @Inject('STORAGE_CONFIG') private readonly config: StorageConfig,
    private readonly logger: Logger, // Inject Logger
  ) {}

  async execute(command: DeleteEmployeeCommand): Promise<Employee | null> {
    this.logger.log(`Deleting employee with ID: ${command.id}`);

    const existingEmployee = await this.employeeRepository.findById(command.id);

    if (!existingEmployee) {
      this.logger.warn(`Employee not found with ID: ${command.id}`);
      throw new NotFoundException('Employee not found');
    }

    // Delete all related files in MinIO
    await this.deleteEmployeeFilesFromMinIO(existingEmployee._id);

    // Delete employee record from the database
    const deletedEmployee = await this.employeeRepository.delete(command.id);
    this.logger.log(`Employee deleted successfully with ID: ${command.id}`);

    return deletedEmployee;
  }

  private async deleteEmployeeFilesFromMinIO(employeeId: string): Promise<void> {
    const profilePrefix = `${this.config.destinationEntityFolder}/${employeeId}/profile/`;
    const coverPrefix = `${this.config.destinationEntityFolder}/${employeeId}/cover/`;

    const profileFiles = await this.minioService.listObjects(this.config.destinationBucket, profilePrefix);
    for (const file of profileFiles) {
      await this.minioService.deleteFile(this.config.destinationBucket, file);
      this.logger.log(`Deleted profile file: ${file}`);
    }

    const coverFiles = await this.minioService.listObjects(this.config.destinationBucket, coverPrefix);
    for (const file of coverFiles) {
      await this.minioService.deleteFile(this.config.destinationBucket, file);
      this.logger.log(`Deleted cover file: ${file}`);
    }
  }
}
