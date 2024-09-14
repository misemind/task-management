import { Test, TestingModule } from '@nestjs/testing';
import { FieldService } from '../../services/field.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateFieldDto } from '../../dto/create-field.dto';
import { UpdateFieldDto } from '../../dto/update-field.dto';

const mockField = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Test Field',
  type: 'text',
  description: 'Test Field Description',
  required: true,
  fieldType: 'default',
  options: [],
};

const mockCommandBus = {
  execute: jest.fn(),
};

const mockQueryBus = {
  execute: jest.fn(),
};

describe('FieldService', () => {
  let service: FieldService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FieldService,
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

    service = module.get<FieldService>(FieldService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createField', () => {
    it('should create a field', async () => {
      const createFieldDto: CreateFieldDto = {
        name: 'Test Field',
        type: 'text',
        description: 'Test Field Description',
        required: true,
        fieldType: 'default',
        options: [],
      };

      mockCommandBus.execute.mockResolvedValue(mockField);

      const result = await service.createField(createFieldDto);

      expect(result).toEqual(mockField);
      expect(mockCommandBus.execute).toHaveBeenCalled();
    });
  });

  describe('updateField', () => {
    it('should update a field by ID', async () => {
      const id = '507f1f77bcf86cd799439011';
      const updateFieldDto: UpdateFieldDto = { name: 'Updated Field' };

      mockCommandBus.execute.mockResolvedValue(mockField);

      const result = await service.updateField(id, updateFieldDto);

      expect(result).toEqual(mockField);
      expect(mockCommandBus.execute).toHaveBeenCalled();
    });
  });

  describe('deleteField', () => {
    it('should delete a field by ID', async () => {
      const id = '507f1f77bcf86cd799439011';
      mockCommandBus.execute.mockResolvedValue(mockField);

      const result = await service.deleteField(id);

      expect(result).toEqual(mockField);
      expect(mockCommandBus.execute).toHaveBeenCalled();
    });
  });
});