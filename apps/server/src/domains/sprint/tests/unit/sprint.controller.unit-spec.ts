import { Test, TestingModule } from '@nestjs/testing';
import { SprintController } from '../../controllers/sprint.controller';
import { SprintService } from '../../services/sprint.service';
import { CreateSprintDto } from '../../dto/create-sprint.dto';
import { UpdateSprintDto } from '../../dto/update-sprint.dto';

const mockSprint = {
  _id: '507f1f77bcf86cd799439011',
  sprintName: 'Sprint 1',
  duration: '2 weeks',
  active: true,
};

const mockSprintService = {
  createSprint: jest.fn(),
  getSprintById: jest.fn(),
  getSprintsByProjectId: jest.fn(),
  updateSprint: jest.fn(),
  deleteSprint: jest.fn(),
};

describe('SprintController', () => {
  let controller: SprintController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SprintController],
      providers: [
        {
          provide: SprintService,
          useValue: mockSprintService,
        },
      ],
    }).compile();

    controller = module.get<SprintController>(SprintController);
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

    mockSprintService.createSprint.mockResolvedValue(mockSprint);

    const result = await controller.create(createSprintDto);

    expect(result).toEqual(mockSprint);
    expect(mockSprintService.createSprint).toHaveBeenCalledWith(createSprintDto);
  });

  it('should return a sprint by ID', async () => {
    const id = '507f1f77bcf86cd799439011';
    mockSprintService.getSprintById.mockResolvedValue(mockSprint);

    const result = await controller.findOne(id);
    expect(result).toEqual(mockSprint);
  });

  it('should update a sprint by ID', async () => {
    const id = '507f1f77bcf86cd799439011';
    const updateSprintDto: UpdateSprintDto = { sprintName: 'Updated Sprint' };

    mockSprintService.updateSprint.mockResolvedValue(mockSprint);

    const result = await controller.update(id, updateSprintDto);

    expect(result).toEqual(mockSprint);
    expect(mockSprintService.updateSprint).toHaveBeenCalledWith(id, updateSprintDto);
  });

  it('should delete a sprint by ID', async () => {
    const id = '507f1f77bcf86cd799439011';
    mockSprintService.deleteSprint.mockResolvedValue(mockSprint);

    const result = await controller.remove(id);

    expect(result).toEqual(mockSprint);
    expect(mockSprintService.deleteSprint).toHaveBeenCalledWith(id);
  });
});