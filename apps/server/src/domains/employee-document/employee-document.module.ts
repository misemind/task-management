
// apps/server/src/domains/employee/employee.module.ts
import { Module, DynamicModule } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EmployeeDocumentController } from './controllers/employee-document.controller';
import { EmployeeDocumentService } from './services/employee-document.service';
import { EmployeeDocumentRepository } from './repositories/employee-document.repository';
import { EmployeeDocumentCommandHandlers } from './commands';
import { EmployeeDocumentQueryHandlers } from './queries';
import { CoreModule } from '@app/core/core.module';
import { StorageConfig } from '@app/core/common/interfaces/storage-config.interface';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeDocument, EmployeeDocumentSchema } from './entities/employee-document.entity';

@Module({
  imports: [
    CqrsModule,
    CoreModule,
    MongooseModule.forFeature([{ name: EmployeeDocument.name, schema: EmployeeDocumentSchema }])
  ],
  providers: [EmployeeDocumentService, EmployeeDocumentRepository, ...EmployeeDocumentCommandHandlers, ...EmployeeDocumentQueryHandlers],
  controllers: [EmployeeDocumentController],
})
export class EmployeeDocumentModule {
  static forRoot(config: StorageConfig ): DynamicModule {
    return {
      module: EmployeeDocumentModule,
      imports: [
        MongooseModule.forFeature([{ name: EmployeeDocument.name, schema: EmployeeDocumentSchema }]),
        CqrsModule,
        CoreModule
      ],
      providers: [
        {
          provide: 'STORAGE_CONFIG',
          useValue: config,
        },
        EmployeeDocumentService,
        EmployeeDocumentRepository,
        ...EmployeeDocumentCommandHandlers,
        ...EmployeeDocumentQueryHandlers,
      ],
      exports: ['STORAGE_CONFIG'],
    };
  }
}