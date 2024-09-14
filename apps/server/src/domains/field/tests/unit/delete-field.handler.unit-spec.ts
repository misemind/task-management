import { Test, TestingModule } from '@nestjs/testing';
import { DeleteFieldHandler } from '../../commands/handlers/delete-field.handler';
import { FieldRepository } from '../../repositories/field.repository';
import { DeleteFieldCommand } from '../../commands/impl/delete-field.command';
import { NotFoundException } from '@nestjs/common';

const mockField = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Test Field',
  type: 'text',
  description: 'Test Field Description',
  required: true,
  fieldType: 'default',
  options: [],
};

describe('DeleteFieldHandler', () => {
  let handler: DeleteFieldHandler;
  let repository: FieldRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteFieldHandler,
        {
          provide: FieldRepository,
          useValue: {
            delete: jest.fn().mockResolvedValue(mockField),
            findById: jest.fn().mockResolvedValue(mockField),  // Default mock returns the field
          },
        },
      ],
    }).compile();

    handler = module.get<DeleteFieldHandler>(DeleteFieldHandler);
    repository = module.get<FieldRepository>(FieldRepository);
  });

  it('should delete a field by ID', async () => {
    const command = new DeleteFieldCommand('507f1f77bcf86cd799439011');

    const result = await handler.execute(command);

    expect(result).toEqual(mockField);
    expect(repository.delete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
  });

});
