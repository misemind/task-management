import { Test, TestingModule } from '@nestjs/testing';
import { CreateFieldHandler } from '../../commands/handlers/create-field.handler';
import { FieldRepository } from '../../repositories/field.repository';
import { CreateFieldCommand } from '../../commands/impl/create-field.command';
import { CreateFieldDto } from '../../dto/create-field.dto';

const mockField = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Test Field',
  type: 'text',
  description: 'Test Field Description',
  required: true,
  fieldType: 'default',
  options: [],
};

describe('CreateFieldHandler', () => {
  let handler: CreateFieldHandler;
  let repository: FieldRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateFieldHandler,
        {
          provide: FieldRepository,
          useValue: {
            create: jest.fn().mockResolvedValue(mockField),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateFieldHandler>(CreateFieldHandler);
    repository = module.get<FieldRepository>(FieldRepository);
  });

  it('should create a field', async () => {
    const createFieldDto: CreateFieldDto = {
      name: 'Test Field',
      type: 'text',
      description: 'Test Field Description',
      required: true,
      fieldType: 'default',
      options: [],
    };

    const command = new CreateFieldCommand(createFieldDto);
    const result = await handler.execute(command);

    expect(result).toEqual(mockField);
    expect(repository.create).toHaveBeenCalledWith(createFieldDto);
  });
});