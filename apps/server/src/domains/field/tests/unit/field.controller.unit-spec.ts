import { Test, TestingModule } from '@nestjs/testing';
import { FieldController } from '../../controllers/field.controller';
import { FieldService } from '../../services/field.service';
import { CreateFieldDto } from '../../dto/create-field.dto';
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

const mockFieldService = {
  createField: jest.fn(),
  getFieldById: jest.fn(),
  updateField: jest.fn(),
  deleteField: jest.fn(),
};

describe('FieldController', () => {
  let controller: FieldController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FieldController],
      providers: [
        {
          provide: FieldService,
          useValue: mockFieldService,
        },
      ],
    }).compile();

    controller = module.get<FieldController>(FieldController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a field', async () => {
      const createFieldDto: CreateFieldDto = {
        name: 'Test Field',
        type: 'text',
        description: 'Test Field Description',
        required: true,
        fieldType: 'default',
        options: [],
      };

      mockFieldService.createField.mockResolvedValue(mockField);

      const result = await controller.create(createFieldDto);

      expect(result).toEqual(mockField);
      expect(mockFieldService.createField).toHaveBeenCalledWith(createFieldDto);
    });
  });

  describe('findOne', () => {
    it('should return a field by ID', async () => {
      const id = '507f1f77bcf86cd799439011';
      mockFieldService.getFieldById.mockResolvedValue(mockField);

      const result = await controller.findOne(id);
      expect(result).toEqual(mockField);
    });

    it('should throw NotFoundException when field not found', async () => {
      const id = 'non-existent-id';
      mockFieldService.getFieldById.mockRejectedValue(new NotFoundException('Field not found'));

      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a field by ID', async () => {
      const id = '507f1f77bcf86cd799439011';
      const updateFieldDto: UpdateFieldDto = { name: 'Updated Field' };

      mockFieldService.updateField.mockResolvedValue(mockField);

      const result = await controller.update(id, updateFieldDto);

      expect(result).toEqual(mockField);
      expect(mockFieldService.updateField).toHaveBeenCalledWith(id, updateFieldDto);
    });
  });

  describe('remove', () => {
    it('should delete a field by ID', async () => {
      const id = '507f1f77bcf86cd799439011';
      mockFieldService.deleteField.mockResolvedValue(mockField);

      const result = await controller.remove(id);

      expect(result).toEqual(mockField);
      expect(mockFieldService.deleteField).toHaveBeenCalledWith(id);
    });
  });
});