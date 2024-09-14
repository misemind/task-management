import { Test, TestingModule } from '@nestjs/testing';
import { IssueTypeController } from '../../controllers/issue-type.controller';
import { IssueTypeService } from '../../services/issue-type.service';
import { CreateIssueTypeDto } from '../../dto/create-issue-type.dto';
import { UpdateIssueTypeDto } from '../../dto/update-issue-type.dto';

const mockIssueType = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Bug',
  description: 'A bug issue type',
  sections: [],
};

const mockIssueTypeService = {
  createIssueType: jest.fn(),
  getIssueTypeById: jest.fn(),
  updateIssueType: jest.fn(),
  deleteIssueType: jest.fn(),
};

describe('IssueTypeController', () => {
  let controller: IssueTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IssueTypeController],
      providers: [
        {
          provide: IssueTypeService,
          useValue: mockIssueTypeService,
        },
      ],
    }).compile();

    controller = module.get<IssueTypeController>(IssueTypeController);
  });

  it('should create an issue type', async () => {
    const createIssueTypeDto: CreateIssueTypeDto = {
      name: 'Bug',
      description: 'A bug issue type',
      sections: [],
    };

    mockIssueTypeService.createIssueType.mockResolvedValue(mockIssueType);

    const result = await controller.create(createIssueTypeDto);

    expect(result).toEqual(mockIssueType);
    expect(mockIssueTypeService.createIssueType).toHaveBeenCalledWith(createIssueTypeDto);
  });

  it('should return an issue type by ID', async () => {
    const id = '507f1f77bcf86cd799439011';
    mockIssueTypeService.getIssueTypeById.mockResolvedValue(mockIssueType);

    const result = await controller.findOne(id);
    expect(result).toEqual(mockIssueType);
  });

  it('should update an issue type by ID', async () => {
    const id = '507f1f77bcf86cd799439011';
    const updateIssueTypeDto: UpdateIssueTypeDto = { name: 'Updated Issue Type' };

    mockIssueTypeService.updateIssueType.mockResolvedValue(mockIssueType);

    const result = await controller.update(id, updateIssueTypeDto);

    expect(result).toEqual(mockIssueType);
    expect(mockIssueTypeService.updateIssueType).toHaveBeenCalledWith(id, updateIssueTypeDto);
  });

  it('should delete an issue type by ID', async () => {
    const id = '507f1f77bcf86cd799439011';
    mockIssueTypeService.deleteIssueType.mockResolvedValue(mockIssueType);

    const result = await controller.remove(id);

    expect(result).toEqual(mockIssueType);
    expect(mockIssueTypeService.deleteIssueType).toHaveBeenCalledWith(id);
  });
});