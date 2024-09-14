import { Test, TestingModule } from '@nestjs/testing';
import { CreateBoardHandler } from '../../commands/handlers/create-board.handler';
import { BoardRepository } from '../../repositories/board.repository';
import { CreateBoardCommand } from '../../commands/impl/create-board.command';
import { CreateBoardDto } from '../../dto/create-board.dto';

const mockBoard = {
  _id: '507f1f77bcf86cd799439011',
  boardName: 'Test Board',
  projectId: '507f1f77bcf86cd799439012',
};

describe('CreateBoardHandler', () => {
  let handler: CreateBoardHandler;
  let repository: BoardRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateBoardHandler,
        {
          provide: BoardRepository,
          useValue: {
            create: jest.fn().mockResolvedValue(mockBoard),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateBoardHandler>(CreateBoardHandler);
    repository = module.get<BoardRepository>(BoardRepository);
  });

  it('should create a board', async () => {
    const createBoardDto: CreateBoardDto = {
      boardName: 'Test Board',
      projectId: '507f1f77bcf86cd799439012',
    };

    const command = new CreateBoardCommand(createBoardDto);
    const result = await handler.execute(command);

    expect(result).toEqual(mockBoard);
    expect(repository.create).toHaveBeenCalledWith(createBoardDto);
  });
});