import { Test, TestingModule } from '@nestjs/testing';
import { BaseEntityService } from '../../services/base-entity.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateBaseEntityDto } from '../../dto/create-base-entity.dto';
import { UpdateBaseEntityDto } from '../../dto/update-base-entity.dto';

const mockBaseEntity = {
  _id: '507f1f77bcf86cd799439011',
  entityType: 'TestEntity',
  entityId: '507f1f77bcf86cd799439012',
  name: 'Test Name',
};

const mockCommandBus = {
  execute: jest.fn(),
};

const mockQueryBus = {
  execute: jest.fn(),
};

describe('BaseEntityService', () => {
  let service: BaseEntityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BaseEntityService,
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

    service = module.get<BaseEntityService>(BaseEntityService);
  });

  it('should create a base entity', async () => {
    const createBaseEntityDto: CreateBaseEntityDto = {
      entityType: 'TestEntity',
      entityId: '507f1f77bcf86cd799439012',
      name: 'Test Name',
    };

    mockCommandBus.execute.mockResolvedValue(mockBaseEntity);

    const result = await service.createBaseEntity(createBaseEntityDto);

    expect(result).toEqual(mockBaseEntity);
    expect(mockCommandBus.execute).toHaveBeenCalled();
  });

  it('should update a base entity by ID', async () => {
    const updateBaseEntityDto: UpdateBaseEntityDto = { name: 'Updated Name' };
    mockCommandBus.execute.mockResolvedValue(mockBaseEntity);

    const result = await service.updateBaseEntity('507f1f77bcf86cd799439011', updateBaseEntityDto);

    expect(result).toEqual(mockBaseEntity);
    expect(mockCommandBus.execute).toHaveBeenCalled();
  });

  it('should delete a base entity by ID', async () => {
    mockCommandBus.execute.mockResolvedValue(mockBaseEntity);

    const result = await service.deleteBaseEntity('507f1f77bcf86cd799439011');

    expect(result).toEqual(mockBaseEntity);
    expect(mockCommandBus.execute).toHaveBeenCalled();
  });
});