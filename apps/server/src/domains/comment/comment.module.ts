// apps/server/src/domains/comment/comment.module.ts
import { Module, DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { CommentController } from './controllers/comment.controller';
import { CommentService } from './services/comment.service';

import { CommentCommandHandlers } from './commands';
import { CommentQueryHandlers } from './queries';
import { CommentRepository } from './repositories/comment.repository';
import { ProjectRepository } from '@app/domains/project/repositories/project.repository';
import { Project, ProjectSchema } from '@app/domains/project/entities/project.entity';
import { Comment, CommentSchema } from './entities/comment.entity';
import { EmployeeModule } from '@app/domains/employee/employee.module';
import { ProjectModule } from '@app/domains/project/project.module';
import { MinioService } from '@app/infrastructure/cloud/minio/minio.service'; // Import MinioService
import { CoreModule } from '@app/core/core.module';
import { StorageConfig } from '@app/core/common/interfaces/storage-config.interface'; // Import StorageConfig interface

@Module({})
export class CommentModule {
  static forRoot(config: StorageConfig): DynamicModule {
    return {
      module: CommentModule,
      imports: [
        MongooseModule.forFeature([
          { name: Comment.name, schema: CommentSchema },
          { name: Project.name, schema: ProjectSchema },
        ]),
        CqrsModule,
        ProjectModule.forRoot(config),
        EmployeeModule.forRoot(config),
        CoreModule, // CoreModule is needed for MinioService
      ],
      providers: [
        {
          provide: 'STORAGE_CONFIG',
          useValue: config,
        },
        CommentService,
        CommentRepository,
        ProjectRepository,
        MinioService, // Provide MinioService
        ...CommentCommandHandlers,
        ...CommentQueryHandlers,
      ],
      controllers: [CommentController],
      exports: [
        'STORAGE_CONFIG',
        CommentService,
        CommentRepository,
        MinioService, // Export MinioService if needed
        ...CommentCommandHandlers,
        ...CommentQueryHandlers,
      ],
    };
  }
}
