import { Test, TestingModule } from '@nestjs/testing';
import { CreateProjectHandler } from '../../commands/handlers/create-project.handler';
import { ProjectRepository } from '../../repositories/project.repository';
import { MinioService } from '../../../../infrastructure/cloud/minio/minio.service';
import { ProjectDocumentService } from '../../../project-document/services/project-document.service';
import { Logger } from '../../../../core/common/logger/logger.service';
import { CreateProjectCommand } from '../../commands/impl/create-project.command';
import { Project } from '../../entities/project.entity';
import { StorageConfig } from '@app/core/common/interfaces/storage-config.interface';

describe('CreateProjectHandler', () => {
  let handler: CreateProjectHandler;
  let projectRepository: ProjectRepository;
  let minioService: MinioService;
  let projectDocumentService: ProjectDocumentService;
  let logger: Logger;

  const mockStorageConfig: StorageConfig = {
    sourceBucket: 'source-bucket',
    destinationBucket: 'destination-bucket',
    destinationEntityFolder: 'projects',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProjectHandler,
        { provide: ProjectRepository, useValue: { create: jest.fn(), update: jest.fn() } },
        { provide: MinioService, useValue: { moveFile: jest.fn() } },
        { provide: ProjectDocumentService, useValue: { createProjectDocument: jest.fn() } },
        { provide: 'STORAGE_CONFIG', useValue: mockStorageConfig },
        { provide: Logger, useValue: { log: jest.fn(), error: jest.fn(), warn: jest.fn() } },
      ],
    }).compile();

    handler = module.get<CreateProjectHandler>(CreateProjectHandler);
    projectRepository = module.get<ProjectRepository>(ProjectRepository);
    minioService = module.get<MinioService>(MinioService);
    projectDocumentService = module.get<ProjectDocumentService>(ProjectDocumentService);
    logger = module.get<Logger>(Logger);
  });

  it('should create a project and handle thumbnail image and files', async () => {
    const createProjectDto = {
      title: 'New Project',
      description: 'A description of the project',
      priority: 'high',
      status: 'pending',
      endDate: new Date('2024-12-31'),
      startDate: new Date(),
      privacy: 'public',
      category: 'category1',
      tags: ['tag1', 'tag2'],
      teamLead: 'teamLeadId',
      skills: ['skill1', 'skill2'],
      employees: ['employee1', 'employee2'],
      thumbnailImage: 'thumbnail.jpg',
      files: [{ fileName: 'doc1.pdf', filePath: 'docs/doc1.pdf', fileSize: 1024, fileExtension: '.pdf' }],
      commentIds: [], // Add this
      updated: new Date(), // Add this
    };
    const command = new CreateProjectCommand(createProjectDto);
    const mockProject = { _id: 'projectId', title: 'New Project' } as Project;

    jest.spyOn(projectRepository, 'create').mockResolvedValue(mockProject);
    jest.spyOn(projectRepository, 'update').mockResolvedValue(mockProject);

    const result = await handler.execute(command);

    expect(projectRepository.create).toHaveBeenCalledWith(createProjectDto);
    expect(minioService.moveFile).toHaveBeenCalledWith(
      'source-bucket',
      'destination-bucket',
      'thumbnail.jpg',
      expect.any(String)
    );
    expect(projectDocumentService.createProjectDocument).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('Creating a new project'));
    expect(result).toBe(mockProject);
  });
});
