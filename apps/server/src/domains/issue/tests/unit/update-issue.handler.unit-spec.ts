import { Test, TestingModule } from '@nestjs/testing';
import { UpdateIssueHandler } from '../../commands/handlers/update-issue.handler';
import { IssueRepository } from '../../repositories/issue.repository';
import { UpdateIssueCommand } from '../../commands/impl/update-issue.command';
import { UpdateIssueDto } from '../../dto/update-issue.dto';
import { NotFoundException } from '@nestjs/common';

const mockIssue = {
  _id: '507f1f77bcf86cd799439011',
  summary: 'Test Issue',
  description: 'A test issue description',
};

describe('UpdateIssueHandler', () => {
  let handler: UpdateIssueHandler;
  let repository: IssueRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateIssueHandler,
        {
          provide: IssueRepository,
          useValue: {
            update: jest.fn().mockResolvedValue(mockIssue),
            findById: jest.fn().mockResolvedValue(mockIssue),
          },
        },
      ],
    }).compile();

    handler = module.get<UpdateIssueHandler>(UpdateIssueHandler);
    repository = module.get<IssueRepository>(IssueRepository);
  });

  it('should update an issue', async () => {
    const updateIssueDto: UpdateIssueDto = { summary: 'Updated Issue' };
    const command = new UpdateIssueCommand('507f1f77bcf86cd799439011', updateIssueDto);

    const result = await handler.execute(command);

    expect(result).toEqual(mockIssue);
    expect(repository.update).toHaveBeenCalledWith('507f1f77bcf86cd799439011', updateIssueDto);
  });

  it('should throw NotFoundException if issue not found', async () => {
    (repository.findById as jest.Mock).mockResolvedValue(null);

    const updateIssueDto: UpdateIssueDto = { summary: 'Updated Issue' };
    const command = new UpdateIssueCommand('507f1f77bcf86cd799439011', updateIssueDto);

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });
});