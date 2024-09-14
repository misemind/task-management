import { Test, TestingModule } from '@nestjs/testing';
import { UpdateIssueTypeHandler } from '../../commands/handlers/update-issue-type.handler';
import { IssueTypeRepository } from '../../repositories/issue-type.repository';
import { UpdateIssueTypeCommand } from '../../commands/impl/update-issue-type.command';
import { UpdateIssueTypeDto } from '../../dto/update-issue-type.dto';
import { NotFoundException } from '@nestjs/common';

const mockIssueType = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Bug',
  description: 'A bug issue type',
  sections: [],
};

describe('UpdateIssueTypeHandler', () => {
  let handler: UpdateIssueTypeHandler;
  let repository: IssueTypeRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateIssueTypeHandler,
        {
          provide: IssueTypeRepository,
          useValue: {
            update: jest.fn().mockResolvedValue(mockIssueType),
            findById: jest.fn().mockResolvedValue(mockIssueType),
          },
        },
      ],
    }).compile();

    handler = module.get<UpdateIssueTypeHandler>(UpdateIssueTypeHandler);
    repository = module.get<IssueTypeRepository>(IssueTypeRepository);
  });

  it('should update an issue type', async () => {
    const updateIssueTypeDto: UpdateIssueTypeDto = { name: 'Updated Issue Type' };
    const command = new UpdateIssueTypeCommand('507f1f77bcf86cd799439011', updateIssueTypeDto);

    const result = await handler.execute(command);

    expect(result).toEqual(mockIssueType);
    expect(repository.update).toHaveBeenCalledWith('507f1f77bcf86cd799439011', updateIssueTypeDto);
  });

  it('should throw NotFoundException if issue type not found', async () => {
    (repository.findById as jest.Mock).mockResolvedValue(null);

    const updateIssueTypeDto: UpdateIssueTypeDto = { name: 'Updated Issue Type' };
    const command = new UpdateIssueTypeCommand('507f1f77bcf86cd799439011', updateIssueTypeDto);

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });
});