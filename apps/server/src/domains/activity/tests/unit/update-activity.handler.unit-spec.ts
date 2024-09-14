import { Test, TestingModule } from '@nestjs/testing';
import { UpdateActivityHandler } from '../../commands/handlers/update-activity.handler';
import { ActivityRepository } from '../../repositories/activity.repository';
import { UpdateActivityCommand } from '../../commands/impl/update-activity.command';
import { UpdateActivityDto } from '../../dto/update-activity.dto';
import { NotFoundException } from '@nestjs/common';

const mockActivity = {
  _id: '507f1f77bcf86cd799439011',
  activityTitle: 'New Task',
};

describe('UpdateActivityHandler', () => {
  let handler: UpdateActivityHandler;
  let repository: ActivityRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateActivityHandler,
        {
          provide: ActivityRepository,
          useValue: {
            update: jest.fn().mockResolvedValue(mockActivity),
            findById: jest.fn().mockResolvedValue(mockActivity),
          },
        },
      ],
    }).compile();

    handler = module.get<UpdateActivityHandler>(UpdateActivityHandler);
    repository = module.get<ActivityRepository>(ActivityRepository);
  });

  it('should update an activity', async () => {
    const updateActivityDto: UpdateActivityDto = { activityTitle: 'Updated Task' };
    const command = new UpdateActivityCommand('507f1f77bcf86cd799439011', updateActivityDto);

    const result = await handler.execute(command);

    expect(result).toEqual(mockActivity);
    expect(repository.update).toHaveBeenCalledWith('507f1f77bcf86cd799439011', updateActivityDto);
  });
});