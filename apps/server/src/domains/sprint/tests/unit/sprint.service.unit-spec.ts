import { Test, TestingModule } from '@nestjs/testing';
import { SprintService } from '../../services/sprint.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateSprintDto } from '../../dto/create-sprint.dto';
import { UpdateSprintDto } from '../../dto/update-sprint.dto';
import { GetSprintByIdQuery } from '../../queries/impl/get-sprint-by-id.query';
import { CreateSprintCommand } from '../../commands/impl/create-sprint.command';

const mockSprint = {
  _id: '507f1f77bcf86cd799439011',
  sprintName: 'Sprint 1',
  duration: '2 weeks',
};

const mockCommandBus = {
  execute: jest.fn(),
};

const mockQueryBus = {
  execute: jest.fn(),
};

describe('SprintService', () => {
  let service: SprintService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SprintService,
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
        {
          provide: QueryBus,
          useValue: mockQueryBus,
        },
      ],
    }).compile();

    service = module.get<SprintService>(SprintService);
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

    mockCommandBus.execute.mockResolvedValue(mockSprint);

    const result = await service.createSprint(createSprintDto);

    expect(result).toEqual(mockSprint);
    expect(mockCommandBus.execute).toHaveBeenCalledWith(new CreateSprintCommand(createSprintDto));
  });

  it('should update a sprint by ID', async () => {
    const id = '507f1f77bcf86cd799439011';
    const updateSprintDto: UpdateSprintDto = { sprintName: 'Updated Sprint' };

    mockCommandBus.execute.mockResolvedValue(mockSprint);

    const result = await service.updateSprint(id, updateSprintDto);

    expect(result).toEqual(mockSprint);
    expect(mockCommandBus.execute).toHaveBeenCalled();
  });

  it('should delete a sprint by ID', async () => {
    const id = '507f1f77bcf86cd799439011';
    mockCommandBus.execute.mockResolvedValue(mockSprint);

    const result = await service.deleteSprint(id);

    expect(result).toEqual(mockSprint);
    expect(mockCommandBus.execute).toHaveBeenCalled();
  });

  it('should return a sprint by ID', async () => {
    const id = '507f1f77bcf86cd799439011';
    mockQueryBus.execute.mockResolvedValue(mockSprint);

    const result = await service.getSprintById(id);
    expect(result).toEqual(mockSprint);
    expect(mockQueryBus.execute).toHaveBeenCalledWith(new GetSprintByIdQuery(id));
  });
});