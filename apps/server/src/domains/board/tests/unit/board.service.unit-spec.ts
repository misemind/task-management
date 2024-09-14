import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from '../../services/board.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateBoardDto } from '../../dto/create-board.dto';
import { UpdateBoardDto } from '../../dto/update-board.dto';

const mockBoard = {
  _id: '507f1f77bcf86cd799439011',
  boardName: 'Test Board',
  projectId: '507f1f77bcf86cd799439012',
};

const mockCommandBus = {
  execute: jest.fn(),
};

const mockQueryBus = {
  execute: jest.fn(),
};

describe('BoardService', () => {
  let service: BoardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardService,
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
        {
          provide: QueryBus,
          useValue: mockQueryBus,
        },
      ],
    }).compile();

    service = module.get<BoardService>(BoardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBoard', () => {
    it('should create a board', async () => {
      const createBoardDto: CreateBoardDto = {
        boardName: 'Test Board',
        projectId: '507f1f77bcf86cd799439012',
      };

      mockCommandBus.execute.mockResolvedValue(mockBoard);

      const result = await service.createBoard(createBoardDto);

      expect(result).toEqual(mockBoard);
      expect(mockCommandBus.execute).toHaveBeenCalled();
    });
  });

  describe('updateBoard', () => {
    it('should update a board by ID', async () => {
      const id = '507f1f77bcf86cd799439011';
      const updateBoardDto: UpdateBoardDto = { boardName: 'Updated Board' };

      mockCommandBus.execute.mockResolvedValue(mockBoard);

      const result = await service.updateBoard(id, updateBoardDto);

      expect(result).toEqual(mockBoard);
      expect(mockCommandBus.execute).toHaveBeenCalled();
    });
  });

  describe('deleteBoard', () => {
    it('should delete a board by ID', async () => {
      const id = '507f1f77bcf86cd799439011';
      mockCommandBus.execute.mockResolvedValue(mockBoard);

      const result = await service.deleteBoard(id);

      expect(result).toEqual(mockBoard);
      expect(mockCommandBus.execute).toHaveBeenCalled();
    });
  });
});