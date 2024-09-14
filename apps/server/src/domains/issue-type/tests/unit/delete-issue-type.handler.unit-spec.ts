import { Test, TestingModule } from '@nestjs/testing';
import { DeleteIssueTypeHandler } from '../../commands/handlers/delete-issue-type.handler';
import { IssueTypeRepository } from '../../repositories/issue-type.repository';
import { DeleteIssueTypeCommand } from '../../commands/impl/delete-issue-type.command';

const mockIssueType = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Bug',
  description: 'A bug issue type',
  sections: [],
};

describe('DeleteIssueTypeHandler', () => {
  let handler: DeleteIssueTypeHandler;
  let repository: IssueTypeRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteIssueTypeHandler,
        {
          provide: IssueTypeRepository,
          useValue: {
            delete: jest.fn().mockResolvedValue(mockIssueType),
          },
        },
      ],
    }).compile();

    handler = module.get<DeleteIssueTypeHandler>(DeleteIssueTypeHandler);
    repository = module.get<IssueTypeRepository>(IssueTypeRepository);
  });

  it('should delete an issue type by ID', async () => {
    const command = new DeleteIssueTypeCommand('507f1f77bcf86cd799439011');

    const result = await handler.execute(command);

    expect(result).toEqual(mockIssueType);
    expect(repository.delete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
  });
});