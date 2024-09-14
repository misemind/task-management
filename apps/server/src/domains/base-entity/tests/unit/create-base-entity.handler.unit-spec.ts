import { Test, TestingModule } from '@nestjs/testing';
import { CreateBaseEntityHandler } from '../../commands/handlers/create-base-entity.handler';
import { BaseEntityRepository } from '../../repositories/base-entity.repository';
import { CreateBaseEntityCommand } from '../../commands/impl/create-base-entity.command';
import { CreateBaseEntityDto } from '../../dto/create-base-entity.dto';

const mockBaseEntity = {
  _id: '507f1f77bcf86cd799439011',
  entityType: 'TestEntity',
  entityId: '507f1f77bcf86cd799439012',
  name: 'Test Name',
};

describe('CreateBaseEntityHandler', () => {
  let handler: CreateBaseEntityHandler;
  let repository: BaseEntityRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateBaseEntityHandler,
        {
          provide: BaseEntityRepository,
          useValue: {
            create: jest.fn().mockResolvedValue(mockBaseEntity),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateBaseEntityHandler>(CreateBaseEntityHandler);
    repository = module.get<BaseEntityRepository>(BaseEntityRepository);
  });

  it('should create a base entity', async () => {
    const createBaseEntityDto: CreateBaseEntityDto = {
      entityType: 'TestEntity',
      entityId: '507f1f77bcf86cd799439012',
      name: 'Test Name',
    };

    const command = new CreateBaseEntityCommand(createBaseEntityDto);
    const result = await handler.execute(command);

    expect(result).toEqual(mockBaseEntity);
    expect(repository.create).toHaveBeenCalledWith(createBaseEntityDto);
  });
});