import { Test, TestingModule } from '@nestjs/testing';
import { ActivityService } from '../../services/activity.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateActivityDto } from '../../dto/create-activity.dto';
import { UpdateActivityDto } from '../../dto/update-activity.dto';
import { GetActivityByIdQuery } from '../../queries/impl/get-activity-by-id.query';
import { CreateActivityCommand } from '../../commands/impl/create-activity.command';

const mockActivity = {
  _id: '507f1f77bcf86cd799439011',
  activityTitle: 'New Task',
};

const mockCommandBus = {
  execute: jest.fn(),
};

const mockQueryBus = {
  execute: jest.fn(),
};

describe('ActivityService', () => {
  let service: ActivityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityService,
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

    service = module.get<ActivityService>(ActivityService);
  });

  it('should create an activity', async () => {
    const createActivityDto: CreateActivityDto = {
      activityTitle: 'New Task',
      project_id: '507f1f77bcf86cd799439012',
      activityType: 'Task',
      status: 'New',
      priority: 'High',
    };

    mockCommandBus.execute.mockResolvedValue(mockActivity);

    const result = await service.createActivity(createActivityDto);

    expect(result).toEqual(mockActivity);
    expect(mockCommandBus.execute).toHaveBeenCalledWith(new CreateActivityCommand(createActivityDto));
  });

  it('should update an activity by ID', async () => {
    const id = '507f1f77bcf86cd799439011';
    const updateActivityDto: UpdateActivityDto = { activityTitle: 'Updated Task' };

    mockCommandBus.execute.mockResolvedValue(mockActivity);

    const result = await service.updateActivity(id, updateActivityDto);

    expect(result).toEqual(mockActivity);
    expect(mockCommandBus.execute).toHaveBeenCalled();
  });

  it('should delete an activity by ID', async () => {
    const id = '507f1f77bcf86cd799439011';
    mockCommandBus.execute.mockResolvedValue(mockActivity);

    const result = await service.deleteActivity(id);

    expect(result).toEqual(mockActivity);
    expect(mockCommandBus.execute).toHaveBeenCalled();
  });

  it('should return an activity by ID', async () => {
    const id = '507f1f77bcf86cd799439011';
    mockQueryBus.execute.mockResolvedValue(mockActivity);

    const result = await service.getActivityById(id);
    expect(result).toEqual(mockActivity);
    expect(mockQueryBus.execute).toHaveBeenCalledWith(new GetActivityByIdQuery(id));
  });
});