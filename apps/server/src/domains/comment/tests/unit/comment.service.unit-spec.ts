import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from '../../services/comment.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCommentDto } from '../../dto/create-comment.dto';
import { UpdateCommentDto } from '../../dto/update-comment.dto';

const mockComment = {
  _id: '507f1f77bcf86cd799439011',
  content: 'Test Comment',
  projectId: '507f1f77bcf86cd799439012',
  userId: '507f1f77bcf86cd799439013',
};

describe('CommentService', () => {
  let service: CommentService;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: CommandBus,
          useValue: { execute: jest.fn() },
        },
        {
          provide: QueryBus,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  it('should create a comment', async () => {
    const createCommentDto: CreateCommentDto = { content: 'Test Comment' };
    jest.spyOn(commandBus, 'execute').mockResolvedValue(mockComment);

    const result = await service.createComment('507f1f77bcf86cd799439012', '507f1f77bcf86cd799439013', createCommentDto);

    expect(result).toEqual(mockComment);
    expect(commandBus.execute).toHaveBeenCalled();
  });

  it('should update a comment', async () => {
    const updateCommentDto: UpdateCommentDto = { content: 'Updated Comment' };
    jest.spyOn(commandBus, 'execute').mockResolvedValue(mockComment);

    const result = await service.updateComment('507f1f77bcf86cd799439011', updateCommentDto);

    expect(result).toEqual(mockComment);
    expect(commandBus.execute).toHaveBeenCalled();
  });
});