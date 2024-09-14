import { Test, TestingModule } from '@nestjs/testing';
import { UpdateBoardHandler } from '../../commands/handlers/update-board.handler';
import { BoardRepository } from '../../repositories/board.repository';
import { UpdateBoardCommand } from '../../commands/impl/update-board.command';
import { UpdateBoardDto } from '../../dto/update-board.dto';
import { NotFoundException } from '@nestjs/common';

const mockBoard = {
  _id: '507f1f77bcf86cd799439011',
  boardName: 'Updated Board',
  projectId: '507f1f77bcf86cd799439012',
};

describe('UpdateBoardHandler', () => {
  let handler: UpdateBoardHandler;
  let repository: BoardRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateBoardHandler,
        {
          provide: BoardRepository,
          useValue: {
            findById: jest.fn().mockResolvedValue(mockBoard),
            update: jest.fn().mockResolvedValue(mockBoard),
          },
        },
      ],
    }).compile();

    handler = module.get<UpdateBoardHandler>(UpdateBoardHandler);
    repository = module.get<BoardRepository>(BoardRepository);
  });

  it('should update a board', async () => {
    const updateBoardDto: UpdateBoardDto = { boardName: 'Updated Board' };
    const command = new UpdateBoardCommand('507f1f77bcf86cd799439011', updateBoardDto);

    const result = await handler.execute(command);

    expect(result).toEqual(mockBoard);
    expect(repository.update).toHaveBeenCalledWith('507f1f77bcf86cd799439011', updateBoardDto);
  });

  it('should throw NotFoundException if board not found', async () => {
    (repository.findById as jest.Mock).mockResolvedValue(null);

    const updateBoardDto: UpdateBoardDto = { boardName: 'Updated Board' };
    const command = new UpdateBoardCommand('507f1f77bcf86cd799439011', updateBoardDto);

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });
});