import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProjectHandler } from '../../commands/handlers/update-project.handler';
import { ProjectRepository } from '../../repositories/project.repository';
import { MinioService } from '../../../../infrastructure/cloud/minio/minio.service';
import { ProjectDocumentService } from '../../../project-document/services/project-document.service';
import { Logger } from '../../../../core/common/logger/logger.service';
import { UpdateProjectCommand } from '../../commands/impl/update-project.command';
import { NotFoundException } from '@nestjs/common';
import { Project } from '../../entities/project.entity';
import { StorageConfig } from '@app/core/common/interfaces/storage-config.interface';

describe('UpdateProjectHandler', () => {
  let handler: UpdateProjectHandler;
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
        UpdateProjectHandler,
        { provide: ProjectRepository, useValue: { findById: jest.fn(), update: jest.fn() } },
        { provide: MinioService, useValue: { moveFile: jest.fn(), deleteFile: jest.fn() } },
        { provide: ProjectDocumentService, useValue: { UpdateProjectDocument: jest.fn() } },
        { provide: 'STORAGE_CONFIG', useValue: mockStorageConfig },
        { provide: Logger, useValue: { log: jest.fn(), error: jest.fn(), warn: jest.fn() } },
      ],
    }).compile();

    handler = module.get<UpdateProjectHandler>(UpdateProjectHandler);
    projectRepository = module.get<ProjectRepository>(ProjectRepository);
    minioService = module.get<MinioService>(MinioService);
    projectDocumentService = module.get<ProjectDocumentService>(ProjectDocumentService);
    logger = module.get<Logger>(Logger);
  });

  it('should update a project successfully', async () => {
    const updateProjectDto = { title: 'Updated Project', priority: 'medium', status: 'inprogress' };
    const command = new UpdateProjectCommand('projectId', updateProjectDto);

    const existingProject = { _id: 'projectId', title: 'Old Project' } as Project;
    const updatedProject = { _id: 'projectId', title: 'Updated Project' } as Project;

    jest.spyOn(projectRepository, 'findById').mockResolvedValue(existingProject);
    jest.spyOn(projectRepository, 'update').mockResolvedValue(updatedProject);

    const result = await handler.execute(command);

    expect(projectRepository.findById).toHaveBeenCalledWith('projectId');
    expect(projectRepository.update).toHaveBeenCalledWith('projectId', expect.any(Object));
    expect(result).toBe(updatedProject);
  });

  it('should throw NotFoundException if project does not exist', async () => {
    const updateProjectDto = { title: 'Non Existing Project' };
    const command = new UpdateProjectCommand('nonExistingId', updateProjectDto);

    jest.spyOn(projectRepository, 'findById').mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
    expect(logger.warn).toHaveBeenCalled();
  });
});
