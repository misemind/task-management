import { Test, TestingModule } from '@nestjs/testing';
import { UpdateSprintHandler } from '../../commands/handlers/update-sprint.handler';
import { SprintRepository } from '../../repositories/sprint.repository';
import { UpdateSprintCommand } from '../../commands/impl/update-sprint.command';
import { UpdateSprintDto } from '../../dto/update-sprint.dto';
import { NotFoundException } from '@nestjs/common';

const mockSprint = {
  _id: '507f1f77bcf86cd799439011',
  sprintName: 'Sprint 1',
  duration: '2 weeks',
};

describe('UpdateSprintHandler', () => {
  let handler: UpdateSprintHandler;
  let repository: SprintRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateSprintHandler,
        {
          provide: SprintRepository,
          useValue: {
            update: jest.fn().mockResolvedValue(mockSprint),
            findById: jest.fn().mockResolvedValue(mockSprint),
          },
        },
      ],
    }).compile();

    handler = module.get<UpdateSprintHandler>(UpdateSprintHandler);
    repository = module.get<SprintRepository>(SprintRepository);
  });

  it('should update a sprint', async () => {
    const updateSprintDto: UpdateSprintDto = { sprintName: 'Updated Sprint' };
    const command = new UpdateSprintCommand('507f1f77bcf86cd799439011', updateSprintDto);

    const result = await handler.execute(command);

    expect(result).toEqual(mockSprint);
    expect(repository.update).toHaveBeenCalledWith('507f1f77bcf86cd799439011', updateSprintDto);
  });

  it('should throw NotFoundException if sprint not found', async () => {
    (repository.findById as jest.Mock).mockResolvedValue(null);

    const updateSprintDto: UpdateSprintDto = { sprintName: 'Updated Sprint' };
    const command = new UpdateSprintCommand('507f1f77bcf86cd799439011', updateSprintDto);

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });
});