import { Module, DynamicModule } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProjectDocumentController } from './controllers/project-document.controller';
import { ProjectDocumentService } from './services/project-document.service';
import { ProjectDocumentRepository } from './repositories/project-document.repository';
import { ProjectDocumentCommandHandlers } from './commands';
import { ProjectDocumentQueryHandlers } from './queries';
import { CoreModule } from '@app/core/core.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectDocument, ProjectDocumentSchema } from './entities/project-document.entity';
import { StorageConfig } from '@app/core/common/interfaces/storage-config.interface';

@Module({
  imports: [
    CqrsModule,
    CoreModule,
    MongooseModule.forFeature([{ name: ProjectDocument.name, schema: ProjectDocumentSchema }])
  ],
  providers: [ProjectDocumentService, ProjectDocumentRepository, ...ProjectDocumentCommandHandlers, ...ProjectDocumentQueryHandlers],
  controllers: [ProjectDocumentController],
  exports: [ProjectDocumentService]
})
export class ProjectDocumentModule {
  static forRoot(config: StorageConfig): DynamicModule {
    return {
      module: ProjectDocumentModule,
      imports: [
        MongooseModule.forFeature([{ name: ProjectDocument.name, schema: ProjectDocumentSchema }]),
        CqrsModule,
        CoreModule
      ],
      providers: [
        {
          provide: 'STORAGE_CONFIG',
          useValue: config,
        },
        ProjectDocumentService,
        ProjectDocumentRepository,
        ...ProjectDocumentCommandHandlers,
        ...ProjectDocumentQueryHandlers,
      ],
      exports: ['STORAGE_CONFIG'],
    };
  }
}