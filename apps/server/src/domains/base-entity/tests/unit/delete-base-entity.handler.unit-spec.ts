import { Test, TestingModule } from '@nestjs/testing';
import { DeleteBaseEntityHandler } from '../../commands/handlers/delete-base-entity.handler';
import { BaseEntityRepository } from '../../repositories/base-entity.repository';
import { DeleteBaseEntityCommand } from '../../commands/impl/delete-base-entity.command';

const mockBaseEntity = {
  _id: '507f1f77bcf86cd799439011',
  entityType: 'TestEntity',
  entityId: '507f1f77bcf86cd799439012',
  name: 'Test Name',
};

describe('DeleteBaseEntityHandler', () => {
  let handler: DeleteBaseEntityHandler;
  let repository: BaseEntityRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteBaseEntityHandler,
        {
          provide: BaseEntityRepository,
          useValue: {
            delete: jest.fn().mockResolvedValue(mockBaseEntity),
          },
        },
      ],
    }).compile();

    handler = module.get<DeleteBaseEntityHandler>(DeleteBaseEntityHandler);
    repository = module.get<BaseEntityRepository>(BaseEntityRepository);
  });

  it('should delete a base entity by ID', async () => {
    const command = new DeleteBaseEntityCommand('507f1f77bcf86cd799439011');
    const result = await handler.execute(command);

    expect(result).toEqual(mockBaseEntity);
    expect(repository.delete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
  });
});