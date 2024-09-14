import { Test, TestingModule } from '@nestjs/testing';
import { CreateIssueTypeHandler } from '../../commands/handlers/create-issue-type.handler';
import { IssueTypeRepository } from '../../repositories/issue-type.repository';
import { CreateIssueTypeCommand } from '../../commands/impl/create-issue-type.command';
import { CreateIssueTypeDto } from '../../dto/create-issue-type.dto';

const mockIssueType = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Bug',
  description: 'A bug issue type',
  sections: [],
};

describe('CreateIssueTypeHandler', () => {
  let handler: CreateIssueTypeHandler;
  let repository: IssueTypeRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateIssueTypeHandler,
        {
          provide: IssueTypeRepository,
          useValue: {
            create: jest.fn().mockResolvedValue(mockIssueType),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateIssueTypeHandler>(CreateIssueTypeHandler);
    repository = module.get<IssueTypeRepository>(IssueTypeRepository);
  });

  it('should create an issue type', async () => {
    const createIssueTypeDto: CreateIssueTypeDto = {
      name: 'Bug',
      description: 'A bug issue type',
      sections: [],
    };

    const command = new CreateIssueTypeCommand(createIssueTypeDto);
    const result = await handler.execute(command);

    expect(result).toEqual(mockIssueType);
    expect(repository.create).toHaveBeenCalledWith(createIssueTypeDto);
  });
});