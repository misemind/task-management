import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';

import { ProjectEmployeeRepository } from './repositories/project-employee.repository';
import { ProjectEmployeeCommandHandlers } from './commands';
import { ProjectEmployeeQueryHandlers } from './queries';
import { EmployeeModule } from '@app/domains/employee/employee.module';
import { ProjectModule } from '@app/domains/project/project.module';
import { ProjectEmployee, ProjectEmployeeSchema } from './entities/project-employee.entity';
import { ProjectEmployeeController } from './controllers/project-employee.controller';
import { ProjectEmployeeService } from './services/project-employee.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ProjectEmployee.name, schema: ProjectEmployeeSchema }]),
    CqrsModule,
    ProjectModule.forRoot({
      sourceBucket: 'transient-files',
      sourceEntityFolder: 'projects',
      destinationBucket: 'documents',
      destinationEntityFolder: 'projects',
    }),
    EmployeeModule.forRoot({
      sourceBucket: 'transient-files',
      sourceEntityFolder: 'employees',
      destinationBucket: 'documents',
      destinationEntityFolder: 'employees',
    }),
  ],
  providers: [
    ProjectEmployeeRepository,
    ProjectEmployeeService,
    ...ProjectEmployeeCommandHandlers,
    ...ProjectEmployeeQueryHandlers,
  ],
  controllers: [ProjectEmployeeController],
  exports: [ProjectEmployeeRepository],
})
export class ProjectEmployeeModule { }