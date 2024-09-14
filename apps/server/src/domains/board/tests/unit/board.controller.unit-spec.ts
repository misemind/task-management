import { Test, TestingModule } from '@nestjs/testing';
import { BoardController } from '../../controllers/board.controller';
import { BoardService } from '../../services/board.service';
import { CreateBoardDto } from '../../dto/create-board.dto';
import { UpdateBoardDto } from '../../dto/update-board.dto';
import { NotFoundException } from '@nestjs/common'; 

const mockBoard = {
  _id: '507f1f77bcf86cd799439011',
  boardName: 'Test Board',
  projectId: '507f1f77bcf86cd799439012',
};

const mockBoardService = {
  createBoard: jest.fn(),
  getBoardById: jest.fn(),
  updateBoard: jest.fn(),
  deleteBoard: jest.fn(),
};

describe('BoardController', () => {
  let controller: BoardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardController],
      providers: [
        {
          provide: BoardService,
          useValue: mockBoardService,
        },
      ],
    }).compile();

    controller = module.get<BoardController>(BoardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a board', async () => {
      const createBoardDto: CreateBoardDto = {
        boardName: 'Test Board',
        projectId: '507f1f77bcf86cd799439012',
      };

      mockBoardService.createBoard.mockResolvedValue(mockBoard);

      const result = await controller.create(createBoardDto);

      expect(result).toEqual(mockBoard);
      expect(mockBoardService.createBoard).toHaveBeenCalledWith(createBoardDto);
    });
  });

  describe('findOne', () => {
    it('should return a board by ID', async () => {
      const id = '507f1f77bcf86cd799439011';
      mockBoardService.getBoardById.mockResolvedValue(mockBoard);

      const result = await controller.findOne(id);
      expect(result).toEqual(mockBoard);
    });

    it('should throw NotFoundException when board not found', async () => {
      const id = 'non-existent-id';
      mockBoardService.getBoardById.mockRejectedValue(new NotFoundException('Board not found'));

      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a board by ID', async () => {
      const id = '507f1f77bcf86cd799439011';
      const updateBoardDto: UpdateBoardDto = { boardName: 'Updated Board' };

      mockBoardService.updateBoard.mockResolvedValue(mockBoard);

      const result = await controller.update(id, updateBoardDto);

      expect(result).toEqual(mockBoard);
      expect(mockBoardService.updateBoard).toHaveBeenCalledWith(id, updateBoardDto);
    });
  });

  describe('remove', () => {
    it('should delete a board by ID', async () => {
      const id = '507f1f77bcf86cd799439011';
      mockBoardService.deleteBoard.mockResolvedValue(mockBoard);

      const result = await controller.remove(id);

      expect(result).toEqual(mockBoard);
      expect(mockBoardService.deleteBoard).toHaveBeenCalledWith(id);
    });
  });
});