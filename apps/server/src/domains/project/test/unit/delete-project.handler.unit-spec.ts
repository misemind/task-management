import { Test, TestingModule } from '@nestjs/testing';
import { DeleteProjectHandler } from '../../commands/handlers/delete-project.handler';
import { ProjectRepository } from '../../repositories/project.repository';
import { DeleteProjectCommand } from '../../commands/impl/delete-project.command';
import { Project } from '../../entities/project.entity';

describe('DeleteProjectHandler', () => {
  let handler: DeleteProjectHandler;
  let projectRepository: ProjectRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteProjectHandler,
        { provide: ProjectRepository, useValue: { delete: jest.fn() } }, // Mock the delete method
      ],
    }).compile();

    handler = module.get<DeleteProjectHandler>(DeleteProjectHandler);
    projectRepository = module.get<ProjectRepository>(ProjectRepository);
  });

  it('should delete a project successfully', async () => {
    const mockProject = { _id: 'projectId' } as Project;
    const command = new DeleteProjectCommand('projectId');

    // Mocking the delete method to return the mock project
    jest.spyOn(projectRepository, 'delete').mockResolvedValue(mockProject);

    const result = await handler.execute(command);

    // Assertions
    expect(projectRepository.delete).toHaveBeenCalledWith('projectId');
    expect(result).toBe(mockProject); // Expecting the result to be the mockProject
  });

  it('should return null if the project does not exist', async () => {
    const command = new DeleteProjectCommand('nonExistingId');

    // Mocking the delete method to return null when project does not exist
    jest.spyOn(projectRepository, 'delete').mockResolvedValue(null);

    const result = await handler.execute(command);

    // Assertions
    expect(projectRepository.delete).toHaveBeenCalledWith('nonExistingId');
    expect(result).toBeNull(); // Expecting the result to be null
  });
});
