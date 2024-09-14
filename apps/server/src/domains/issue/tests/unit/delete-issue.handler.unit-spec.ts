import { Test, TestingModule } from '@nestjs/testing';
import { DeleteIssueHandler } from '../../commands/handlers/delete-issue.handler';
import { IssueRepository } from '../../repositories/issue.repository';
import { DeleteIssueCommand } from '../../commands/impl/delete-issue.command';

const mockIssue = {
  _id: '507f1f77bcf86cd799439011',
  summary: 'Test Issue',
  description: 'A test issue description',
};

describe('DeleteIssueHandler', () => {
  let handler: DeleteIssueHandler;
  let repository: IssueRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteIssueHandler,
        {
          provide: IssueRepository,
          useValue: {
            delete: jest.fn().mockResolvedValue(mockIssue),
          },
        },
      ],
    }).compile();

    handler = module.get<DeleteIssueHandler>(DeleteIssueHandler);
    repository = module.get<IssueRepository>(IssueRepository);
  });

  it('should delete an issue by ID', async () => {
    const command = new DeleteIssueCommand('507f1f77bcf86cd799439011');

    const result = await handler.execute(command);

    expect(result).toEqual(mockIssue);
    expect(repository.delete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
  });
});