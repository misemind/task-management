import { Test, TestingModule } from '@nestjs/testing';
import { IssueController } from '../../controllers/issue.controller';
import { IssueService } from '../../services/issue.service';
import { CreateIssueDto } from '../../dto/create-issue.dto';
import { UpdateIssueDto } from '../../dto/update-issue.dto';

const mockIssue = {
  _id: '507f1f77bcf86cd799439011',
  summary: 'Test Issue',
  description: 'A test issue description',
};

const mockIssueService = {
  createIssue: jest.fn(),
  getIssueById: jest.fn(),
  getIssuesByProjectId: jest.fn(),
  updateIssue: jest.fn(),
  deleteIssue: jest.fn(),
};

describe('IssueController', () => {
  let controller: IssueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IssueController],
      providers: [
        {
          provide: IssueService,
          useValue: mockIssueService,
        },
      ],
    }).compile();

    controller = module.get<IssueController>(IssueController);
  });

  it('should create an issue', async () => {
    const createIssueDto: CreateIssueDto = {
      summary: 'Test Issue',
      description: 'A test issue description',
      projectId: '507f1f77bcf86cd799439012',
      issueTypeId: '507f1f77bcf86cd799439013',
      fieldValues: [],
    };

    mockIssueService.createIssue.mockResolvedValue(mockIssue);

    const result = await controller.create(createIssueDto);

    expect(result).toEqual(mockIssue);
    expect(mockIssueService.createIssue).toHaveBeenCalledWith(createIssueDto);
  });

  it('should return an issue by ID', async () => {
    const id = '507f1f77bcf86cd799439011';
    mockIssueService.getIssueById.mockResolvedValue(mockIssue);

    const result = await controller.findOne(id);
    expect(result).toEqual(mockIssue);
  });

  it('should update an issue by ID', async () => {
    const id = '507f1f77bcf86cd799439011';
    const updateIssueDto: UpdateIssueDto = { summary: 'Updated Issue' };

    mockIssueService.updateIssue.mockResolvedValue(mockIssue);

    const result = await controller.update(id, updateIssueDto);

    expect(result).toEqual(mockIssue);
    expect(mockIssueService.updateIssue).toHaveBeenCalledWith(id, updateIssueDto);
  });

  it('should delete an issue by ID', async () => {
    const id = '507f1f77bcf86cd799439011';
    mockIssueService.deleteIssue.mockResolvedValue(mockIssue);

    const result = await controller.remove(id);

    expect(result).toEqual(mockIssue);
    expect(mockIssueService.deleteIssue).toHaveBeenCalledWith(id);
  });
});