import { Test, TestingModule } from '@nestjs/testing';
import { IssueTypeService } from '../../services/issue-type.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateIssueTypeDto } from '../../dto/create-issue-type.dto';
import { UpdateIssueTypeDto } from '../../dto/update-issue-type.dto';

const mockIssueType = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Bug',
  description: 'A bug issue type',
  sections: [],
};

const mockCommandBus = {
  execute: jest.fn(),
};

const mockQueryBus = {
  execute: jest.fn(),
};

describe('IssueTypeService', () => {
  let service: IssueTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IssueTypeService,
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

    service = module.get<IssueTypeService>(IssueTypeService);
  });

  it('should create an issue type', async () => {
    const createIssueTypeDto: CreateIssueTypeDto = {
      name: 'Bug',
      description: 'A bug issue type',
      sections: [],
    };

    mockCommandBus.execute.mockResolvedValue(mockIssueType);

    const result = await service.createIssueType(createIssueTypeDto);

    expect(result).toEqual(mockIssueType);
    expect(mockCommandBus.execute).toHaveBeenCalled();
  });

  it('should update an issue type by ID', async () => {
    const id = '507f1f77bcf86cd799439011';
    const updateIssueTypeDto: UpdateIssueTypeDto = { name: 'Updated Issue Type' };

    mockCommandBus.execute.mockResolvedValue(mockIssueType);

    const result = await service.updateIssueType(id, updateIssueTypeDto);

    expect(result).toEqual(mockIssueType);
    expect(mockCommandBus.execute).toHaveBeenCalled();
  });

  it('should delete an issue type by ID', async () => {
    const id = '507f1f77bcf86cd799439011';
    mockCommandBus.execute.mockResolvedValue(mockIssueType);

    const result = await service.deleteIssueType(id);

    expect(result).toEqual(mockIssueType);
    expect(mockCommandBus.execute).toHaveBeenCalled();
  });
});