import { Test, TestingModule } from '@nestjs/testing';
import { IssueService } from '../../services/issue.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateIssueDto } from '../../dto/create-issue.dto';
import { UpdateIssueDto } from '../../dto/update-issue.dto';

const mockIssue = {
  _id: '507f1f77bcf86cd799439011',
  summary: 'Test Issue',
  description: 'A test issue description',
};

const mockCommandBus = {
  execute: jest.fn(),
};

const mockQueryBus = {
  execute: jest.fn(),
};

describe('IssueService', () => {
  let service: IssueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IssueService,
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

    service = module.get<IssueService>(IssueService);
  });

  it('should create an issue', async () => {
    const createIssueDto: CreateIssueDto = {
      summary: 'Test Issue',
      description: 'A test issue description',
      projectId: '507f1f77bcf86cd799439012',
      issueTypeId: '507f1f77bcf86cd799439013',
      fieldValues: [],
    };

    mockCommandBus.execute.mockResolvedValue(mockIssue);

    const result = await service.createIssue(createIssueDto);

    expect(result).toEqual(mockIssue);
    expect(mockCommandBus.execute).toHaveBeenCalled();
  });

  it('should update an issue by ID', async () => {
    const id = '507f1f77bcf86cd799439011';
    const updateIssueDto: UpdateIssueDto = { summary: 'Updated Issue' };

    mockCommandBus.execute.mockResolvedValue(mockIssue);

    const result = await service.updateIssue(id, updateIssueDto);

    expect(result).toEqual(mockIssue);
    expect(mockCommandBus.execute).toHaveBeenCalled();
  });

  it('should delete an issue by ID', async () => {
    const id = '507f1f77bcf86cd799439011';
    mockCommandBus.execute.mockResolvedValue(mockIssue);

    const result = await service.deleteIssue(id);

    expect(result).toEqual(mockIssue);
    expect(mockCommandBus.execute).toHaveBeenCalled();
  });
});