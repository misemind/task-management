import { Test, TestingModule } from '@nestjs/testing';
import { DeleteActivityHandler } from '../../commands/handlers/delete-activity.handler';
import { ActivityRepository } from '../../repositories/activity.repository';
import { DeleteActivityCommand } from '../../commands/impl/delete-activity.command';

const mockActivity = {
  _id: '507f1f77bcf86cd799439011',
  activityTitle: 'New Task',
  project_id: '507f1f77bcf86cd799439012',
};

describe('DeleteActivityHandler', () => {
  let handler: DeleteActivityHandler;
  let repository: ActivityRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteActivityHandler,
        {
          provide: ActivityRepository,
          useValue: {
            delete: jest.fn().mockResolvedValue(mockActivity),
          },
        },
      ],
    }).compile();

    handler = module.get<DeleteActivityHandler>(DeleteActivityHandler);
    repository = module.get<ActivityRepository>(ActivityRepository);
  });

  it('should delete an activity by ID', async () => {
    const command = new DeleteActivityCommand('507f1f77bcf86cd799439011');

    const result = await handler.execute(command);

    expect(result).toEqual(mockActivity);
    expect(repository.delete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
  });
});