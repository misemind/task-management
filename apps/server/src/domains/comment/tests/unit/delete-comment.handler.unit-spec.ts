// ../apps/server/src/domains/comment/tests/unit/delete-comment.handler.unit-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { DeleteCommentHandler } from '../../commands/handlers/delete-comment.handler';
import { CommentRepository } from '../../repositories/comment.repository';
import { ProjectRepository } from '@app/domains/project/repositories/project.repository'; // Include this
import { DeleteCommentCommand } from '../../commands/impl/delete-comment.command';
import { NotFoundException } from '@nestjs/common';

const mockComment = {
  _id: '507f1f77bcf86cd799439011',
  content: 'Test Comment',
  projectId: '507f1f77bcf86cd799439012',
  parentId: null,
};

describe('DeleteCommentHandler', () => {
  let handler: DeleteCommentHandler;
  let commentRepository: CommentRepository;
  let projectRepository: ProjectRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteCommentHandler,
        {
          provide: CommentRepository,
          useValue: {
            findById: jest.fn().mockResolvedValue(mockComment),
            delete: jest.fn(),
            removeReply: jest.fn(),
          },
        },
        {
          provide: ProjectRepository, // Mock the ProjectRepository
          useValue: {
            findById: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    handler = module.get<DeleteCommentHandler>(DeleteCommentHandler);
    commentRepository = module.get<CommentRepository>(CommentRepository);
    projectRepository = module.get<ProjectRepository>(ProjectRepository); // Assign it here
  });

  it('should delete a comment', async () => {
    const command = new DeleteCommentCommand('507f1f77bcf86cd799439011');
    await handler.execute(command);

    expect(commentRepository.delete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
  });

  it('should throw NotFoundException if comment not found', async () => {
    jest.spyOn(commentRepository, 'findById').mockResolvedValue(null);

    const command = new DeleteCommentCommand('non-existent-comment');
    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });
});
