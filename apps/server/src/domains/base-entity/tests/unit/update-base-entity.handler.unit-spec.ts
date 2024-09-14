import { Test, TestingModule } from '@nestjs/testing';
import { UpdateBaseEntityHandler } from '../../commands/handlers/update-base-entity.handler';
import { BaseEntityRepository } from '../../repositories/base-entity.repository';
import { UpdateBaseEntityCommand } from '../../commands/impl/update-base-entity.command';
import { UpdateBaseEntityDto } from '../../dto/update-base-entity.dto';

const mockBaseEntity = {
  _id: '507f1f77bcf86cd799439011',
  entityType: 'TestEntity',
  entityId: '507f1f77bcf86cd799439012',
  name: 'Updated Name',
};

describe('UpdateBaseEntityHandler', () => {
  let handler: UpdateBaseEntityHandler;
  let repository: BaseEntityRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateBaseEntityHandler,
        {
          provide: BaseEntityRepository,
          useValue: {
            update: jest.fn().mockResolvedValue(mockBaseEntity),
          },
        },
      ],
    }).compile();

    handler = module.get<UpdateBaseEntityHandler>(UpdateBaseEntityHandler);
    repository = module.get<BaseEntityRepository>(BaseEntityRepository);
  });

  it('should update a base entity', async () => {
    const updateBaseEntityDto: UpdateBaseEntityDto = { name: 'Updated Name' };
    const command = new UpdateBaseEntityCommand('507f1f77bcf86cd799439011', updateBaseEntityDto);

    const result = await handler.execute(command);

    expect(result).toEqual(mockBaseEntity);
    expect(repository.update).toHaveBeenCalledWith('507f1f77bcf86cd799439011', updateBaseEntityDto);
  });
});