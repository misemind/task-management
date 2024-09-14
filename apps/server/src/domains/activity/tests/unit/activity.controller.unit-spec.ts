import { Test, TestingModule } from '@nestjs/testing';
import { ActivityController } from '../../controllers/activity.controller';
import { ActivityService } from '../../services/activity.service';
import { CreateActivityDto } from '../../dto/create-activity.dto';
import { UpdateActivityDto } from '../../dto/update-activity.dto';

const mockActivity = {
  _id: '507f1f77bcf86cd799439011',
  activityTitle: 'New Task',
  project_id: '507f1f77bcf86cd799439012',
  activityType: 'Task',
  status: 'New',
  priority: 'High',
};

const mockActivityService = {
  createActivity: jest.fn(),
  getActivityById: jest.fn(),
  updateActivity: jest.fn(),
  deleteActivity: jest.fn(),
};

describe('ActivityController', () => {
  let controller: ActivityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityController],
      providers: [
        {
          provide: ActivityService,
          useValue: mockActivityService,
        },
      ],
    }).compile();

    controller = module.get<ActivityController>(ActivityController);
  });

  it('should create an activity', async () => {
    const createActivityDto: CreateActivityDto = {
      activityTitle: 'New Task',
      project_id: '507f1f77bcf86cd799439012',
      activityType: 'Task',
      status: 'New',
      priority: 'High',
    };

    mockActivityService.createActivity.mockResolvedValue(mockActivity);

    const result = await controller.create(createActivityDto);

    expect(result).toEqual(mockActivity);
    expect(mockActivityService.createActivity).toHaveBeenCalledWith(createActivityDto);
  });

  it('should return an activity by ID', async () => {
    const id = '507f1f77bcf86cd799439011';
    mockActivityService.getActivityById.mockResolvedValue(mockActivity);

    const result = await controller.findOne(id);
    expect(result).toEqual(mockActivity);
  });

  it('should update an activity by ID', async () => {
    const id = '507f1f77bcf86cd799439011';
    const updateActivityDto: UpdateActivityDto = { activityTitle: 'Updated Task' };

    mockActivityService.updateActivity.mockResolvedValue(mockActivity);

    const result = await controller.update(id, updateActivityDto);

    expect(result).toEqual(mockActivity);
    expect(mockActivityService.updateActivity).toHaveBeenCalledWith(id, updateActivityDto);
  });

  it('should delete an activity by ID', async () => {
    const id = '507f1f77bcf86cd799439011';
    mockActivityService.deleteActivity.mockResolvedValue(mockActivity);

    const result = await controller.remove(id);

    expect(result).toEqual(mockActivity);
    expect(mockActivityService.deleteActivity).toHaveBeenCalledWith(id);
  });
});