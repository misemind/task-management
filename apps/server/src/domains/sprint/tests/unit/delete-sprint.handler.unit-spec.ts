import { Test, TestingModule } from '@nestjs/testing';
import { DeleteSprintHandler } from '../../commands/handlers/delete-sprint.handler';
import { SprintRepository } from '../../repositories/sprint.repository';
import { DeleteSprintCommand } from '../../commands/impl/delete-sprint.command';

const mockSprint = {
  _id: '507f1f77bcf86cd799439011',
  sprintName: 'Sprint 1',
  boardId: '507f1f77bcf86cd799439012',
  projectId: '507f1f77bcf86cd799439013',
};

describe('DeleteSprintHandler', () => {
  let handler: DeleteSprintHandler;
  let repository: SprintRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteSprintHandler,
        {
          provide: SprintRepository,
          useValue: {
            delete: jest.fn().mockResolvedValue(mockSprint),
          },
        },
      ],
    }).compile();

    handler = module.get<DeleteSprintHandler>(DeleteSprintHandler);
    repository = module.get<SprintRepository>(SprintRepository);
  });

  it('should delete a sprint by ID', async () => {
    const command = new DeleteSprintCommand('507f1f77bcf86cd799439011');

    const result = await handler.execute(command);

    expect(result).toEqual(mockSprint);
    expect(repository.delete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
  });
});