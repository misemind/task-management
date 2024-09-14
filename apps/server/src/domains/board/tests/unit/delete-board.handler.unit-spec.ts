import { Test, TestingModule } from '@nestjs/testing';
import { DeleteBoardHandler } from '../../commands/handlers/delete-board.handler';
import { BoardRepository } from '../../repositories/board.repository';
import { DeleteBoardCommand } from '../../commands/impl/delete-board.command';
import { NotFoundException } from '@nestjs/common'; // Ensure this is imported

const mockBoard = {
  _id: '507f1f77bcf86cd799439011',
  boardName: 'Test Board',
  projectId: '507f1f77bcf86cd799439012',
};

describe('DeleteBoardHandler', () => {
  let handler: DeleteBoardHandler;
  let repository: BoardRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteBoardHandler,
        {
          provide: BoardRepository,
          useValue: {
            delete: jest.fn(), // Leave this to be mocked per test
            findById: jest.fn().mockResolvedValue(mockBoard), // Mock for general case
          },
        },
      ],
    }).compile();

    handler = module.get<DeleteBoardHandler>(DeleteBoardHandler);
    repository = module.get<BoardRepository>(BoardRepository);
  });

  it('should delete a board by ID', async () => {
    repository.delete = jest.fn().mockResolvedValue(mockBoard); // Simulate success case

    const command = new DeleteBoardCommand('507f1f77bcf86cd799439011');
    const result = await handler.execute(command);

    expect(result).toEqual(mockBoard);
    expect(repository.delete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
  });

});
