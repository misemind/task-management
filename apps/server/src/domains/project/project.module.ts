import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { ProjectController } from './controllers/project.controller';
import { ProjectService } from './services/project.service';
import { Project, ProjectSchema } from './entities/project.entity';
import { ProjectCommandHandlers } from './commands';
import { ProjectQueryHandlers } from './queries';
import { ProjectRepository } from './repositories/project.repository';

import { CoreModule } from '@app/core/core.module';
import { ActivityModule } from '@app/domains/activity/activity.module';
import { StorageConfig } from '@app/core/common/interfaces/storage-config.interface';
import { ProjectDocumentModule } from '@app/domains/project-document/project-document.module';
import { ProjectDocumentController } from '@app/domains/project-document/controllers/project-document.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    CqrsModule,
    CoreModule,
    ActivityModule,
    ProjectDocumentModule.forRoot({
      sourceBucket: 'transient-files',
      destinationBucket: 'documents',
      destinationEntityFolder: 'projects',
    })
  ],
  providers: [ProjectService, ProjectRepository, ...ProjectCommandHandlers, ...ProjectQueryHandlers],
  controllers: [ProjectController, ProjectDocumentController],
  exports: [ProjectService, ProjectRepository, ...ProjectCommandHandlers, ...ProjectQueryHandlers]
})
export class ProjectModule {
  static forRoot(config: StorageConfig): DynamicModule {
    return {
      module: ProjectModule,
      imports: [
        MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
        CqrsModule,
        CoreModule
      ],
      providers: [
        {
          provide: 'STORAGE_CONFIG',
          useValue: config,
        },
        ProjectService,
        ProjectRepository,
        ...ProjectCommandHandlers, ...ProjectQueryHandlers
      ],
      exports: ['STORAGE_CONFIG'],
    };
  }
}
