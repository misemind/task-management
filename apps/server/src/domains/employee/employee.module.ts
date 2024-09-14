// apps/server/src/domains/employee/employee.module.ts
import { Module, DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';  // Import MongooseModule
import { CqrsModule } from '@nestjs/cqrs';
import { EmployeeController } from './controllers/employee.controller';
import { EmployeeService } from './services/employee.service';
import { EmployeeRepository } from './repositories/employee.repository';
import { EmployeeCommandHandlers } from './commands';
import { EmployeeQueryHandlers } from './queries';
import { CoreModule } from '@app/core/core.module';
import { StorageConfig } from '@app/core/common/interfaces/storage-config.interface';
import { Employee, EmployeeSchema } from './entities/employee.entity';

@Module({})
export class EmployeeModule {
  static forRoot(config: StorageConfig): DynamicModule {
    return {
      module: EmployeeModule,
      imports: [
        MongooseModule.forFeature([{ name: Employee.name, schema: EmployeeSchema }]),  // Add MongooseModule.forFeature here as well
        CqrsModule,
        CoreModule
      ],
      providers: [
        {
          provide: 'STORAGE_CONFIG',
          useValue: config,
        },
        EmployeeService,
        EmployeeRepository,
        ...EmployeeCommandHandlers,
        ...EmployeeQueryHandlers,
      ],
      controllers:[EmployeeController],
      exports: [
        'STORAGE_CONFIG',
        EmployeeService,
        EmployeeRepository,
        ...EmployeeCommandHandlers,
        ...EmployeeQueryHandlers,
      ],
    };
  }
}
