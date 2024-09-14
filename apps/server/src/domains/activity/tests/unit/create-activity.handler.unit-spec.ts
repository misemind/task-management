import { Test, TestingModule } from '@nestjs/testing';
import { CreateActivityHandler } from '../../commands/handlers/create-activity.handler';
import { ActivityRepository } from '../../repositories/activity.repository';
import { CreateActivityCommand } from '../../commands/impl/create-activity.command';
import { CreateActivityDto } from '../../dto/create-activity.dto';

const mockActivity = {
  _id: '507f1f77bcf86cd799439011',
  activityTitle: 'New Task',
  project_id: '507f1f77bcf86cd799439012',
  activityType: 'Task',
  status: 'New',
  priority: 'High',
};

describe('CreateActivityHandler', () => {
  let handler: CreateActivityHandler;
  let repository: ActivityRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateActivityHandler,
        {
          provide: ActivityRepository,
          useValue: {
            create: jest.fn().mockResolvedValue(mockActivity),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateActivityHandler>(CreateActivityHandler);
    repository = module.get<ActivityRepository>(ActivityRepository);
  });

  it('should create an activity', async () => {
    const createActivityDto: CreateActivityDto = {
      activityTitle: 'New Task',
      project_id: '507f1f77bcf86cd799439012',
      activityType: 'Task',
      status: 'New',
      priority: 'High',
    };

    const command = new CreateActivityCommand(createActivityDto);
    const result = await handler.execute(command);

    expect(result).toEqual(mockActivity);
    expect(repository.create).toHaveBeenCalledWith(createActivityDto);
  });
});