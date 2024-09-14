import { Test, TestingModule } from '@nestjs/testing';
import { UpdateFieldHandler } from '../../commands/handlers/update-field.handler';
import { FieldRepository } from '../../repositories/field.repository';
import { UpdateFieldCommand } from '../../commands/impl/update-field.command';
import { UpdateFieldDto } from '../../dto/update-field.dto';
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

describe('UpdateFieldHandler', () => {
  let handler: UpdateFieldHandler;
  let repository: FieldRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateFieldHandler,
        {
          provide: FieldRepository,
          useValue: {
            update: jest.fn().mockResolvedValue(mockField),
            findById: jest.fn().mockResolvedValue(mockField),  // Ensure findById is mocked with jest.fn()
          },
        },
      ],
    }).compile();

    handler = module.get<UpdateFieldHandler>(UpdateFieldHandler);
    repository = module.get<FieldRepository>(FieldRepository);
  });

  it('should update a field', async () => {
    const updateFieldDto: UpdateFieldDto = { name: 'Updated Field' };
    const command = new UpdateFieldCommand('507f1f77bcf86cd799439011', updateFieldDto);

    const result = await handler.execute(command);

    expect(result).toEqual(mockField);
    expect(repository.update).toHaveBeenCalledWith('507f1f77bcf86cd799439011', updateFieldDto);
  });

  it('should throw NotFoundException if field not found', async () => {
    (repository.findById as jest.Mock).mockResolvedValue(null);  

    const updateFieldDto: UpdateFieldDto = { name: 'Updated Field' };
    const command = new UpdateFieldCommand('507f1f77bcf86cd799439011', updateFieldDto);

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });
});
