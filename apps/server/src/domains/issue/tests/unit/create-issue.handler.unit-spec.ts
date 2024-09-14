import { Test, TestingModule } from '@nestjs/testing';
import { CreateIssueHandler } from '../../commands/handlers/create-issue.handler';
import { IssueRepository } from '../../repositories/issue.repository';
import { CreateIssueCommand } from '../../commands/impl/create-issue.command';
import { CreateIssueDto } from '../../dto/create-issue.dto';

const mockIssue = {
  _id: '507f1f77bcf86cd799439011',
  summary: 'Test Issue',
  description: 'A test issue description',
  project_id: '507f1f77bcf86cd799439012',
  issue_type_id: '507f1f77bcf86cd799439013',
  field_values: [],
};

describe('CreateIssueHandler', () => {
  let handler: CreateIssueHandler;
  let repository: IssueRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateIssueHandler,
        {
          provide: IssueRepository,
          useValue: {
            create: jest.fn().mockResolvedValue(mockIssue),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateIssueHandler>(CreateIssueHandler);
    repository = module.get<IssueRepository>(IssueRepository);
  });

  it('should create an issue', async () => {
    const createIssueDto: CreateIssueDto = {
      summary: 'Test Issue',
      description: 'A test issue description',
      projectId: '507f1f77bcf86cd799439012',
      issueTypeId: '507f1f77bcf86cd799439013',
      fieldValues: [],
    };

    const command = new CreateIssueCommand(createIssueDto);
    const result = await handler.execute(command);

    expect(result).toEqual(mockIssue);
    expect(repository.create).toHaveBeenCalledWith(createIssueDto);
  });
});