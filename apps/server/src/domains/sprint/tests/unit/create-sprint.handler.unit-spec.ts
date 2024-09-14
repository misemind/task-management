import { Test, TestingModule } from '@nestjs/testing';
import { CreateSprintHandler } from '../../commands/handlers/create-sprint.handler';
import { SprintRepository } from '../../repositories/sprint.repository';
import { CreateSprintCommand } from '../../commands/impl/create-sprint.command';
import { CreateSprintDto } from '../../dto/create-sprint.dto';

const mockSprint = {
  _id: '507f1f77bcf86cd799439011',
  sprintName: 'Sprint 1',
  boardId: '507f1f77bcf86cd799439012',
  projectId: '507f1f77bcf86cd799439013',
  duration: '2 weeks',
  startDatetime: '2023-09-01T00:00:00.000Z',
  endDatetime: '2023-09-14T23:59:59.999Z',
  active: true,
  sprintGoal: 'Complete all high-priority tasks',
};

describe('CreateSprintHandler', () => {
  let handler: CreateSprintHandler;
  let repository: SprintRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSprintHandler,
        {
          provide: SprintRepository,
          useValue: {
            create: jest.fn().mockResolvedValue(mockSprint),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateSprintHandler>(CreateSprintHandler);
    repository = module.get<SprintRepository>(SprintRepository);
  });

  it('should create a sprint', async () => {
    const createSprintDto: CreateSprintDto = {
      sprintName: 'Sprint 1',
      boardId: '507f1f77bcf86cd799439012',
      projectId: '507f1f77bcf86cd799439013',
      duration: '2 weeks',
      startDatetime: '2023-09-01T00:00:00.000Z',
      endDatetime: '2023-09-14T23:59:59.999Z',
      active: true,
      sprintGoal: 'Complete all high-priority tasks',
    };

    const command = new CreateSprintCommand(createSprintDto);
    const result = await handler.execute(command);

    expect(result).toEqual(mockSprint);
    expect(repository.create).toHaveBeenCalledWith(createSprintDto);
  });
});