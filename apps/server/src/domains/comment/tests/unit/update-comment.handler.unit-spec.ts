import { Test, TestingModule } from '@nestjs/testing';
import { UpdateCommentHandler } from '../../commands/handlers/update-comment.handler';
import { CommentRepository } from '../../repositories/comment.repository';
import { UpdateCommentCommand } from '../../commands/impl/update-comment.command';
import { NotFoundException } from '@nestjs/common';

const mockComment = {
  _id: '507f1f77bcf86cd799439011',
  content: 'Test Comment',
  projectId: '507f1f77bcf86cd799439012',
  parentId: null,
};

describe('UpdateCommentHandler', () => {
  let handler: UpdateCommentHandler;
  let commentRepository: CommentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCommentHandler,
        {
          provide: CommentRepository,
          useValue: {
            findById: jest.fn().mockResolvedValue(mockComment),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<UpdateCommentHandler>(UpdateCommentHandler);
    commentRepository = module.get<CommentRepository>(CommentRepository);
  });

  it('should update a comment', async () => {
    const command = new UpdateCommentCommand('507f1f77bcf86cd799439011', 'Updated Comment');

    await handler.execute(command);

    expect(commentRepository.update).toHaveBeenCalledWith('507f1f77bcf86cd799439011', { ...mockComment, content: 'Updated Comment' });
  });

  it('should throw NotFoundException if comment not found', async () => {
    jest.spyOn(commentRepository, 'findById').mockResolvedValue(null);

    const command = new UpdateCommentCommand('non-existent-comment', 'Updated Comment');
    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });
});