import { Test, TestingModule } from '@nestjs/testing';
import { CreateCommentHandler } from '../../commands/handlers/create-comment.handler';
import { CommentRepository } from '../../repositories/comment.repository';
import { ProjectRepository } from '@app/domains/project/repositories/project.repository';
import { EmployeeRepository } from '@app/domains/employee/repositories/employee.repository';
import { MinioService } from '@app/infrastructure/cloud/minio/minio.service';
import { CreateCommentCommand } from '../../commands/impl/create-comment.command';
import { NotFoundException } from '@nestjs/common';

const mockComment = {
  _id: '507f1f77bcf86cd799439011',
  content: 'Test Comment',
  projectId: '507f1f77bcf86cd799439012',
  userId: '507f1f77bcf86cd799439013',
  replies: [],
  files: [],
};

const mockEmployee = {
  _id: '507f1f77bcf86cd799439013',
  name: 'Test User',
};

const mockProject = {
  _id: '507f1f77bcf86cd799439012',
  commentIds: [],
};

describe('CreateCommentHandler', () => {
  let handler: CreateCommentHandler;
  let commentRepository: CommentRepository;
  let projectRepository: ProjectRepository;
  let employeeRepository: EmployeeRepository;
  let minioService: MinioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCommentHandler,
        {
          provide: CommentRepository,
          useValue: {
            create: jest.fn().mockResolvedValue(mockComment),
            addReply: jest.fn(),
          },
        },
        {
          provide: ProjectRepository,
          useValue: {
            findById: jest.fn().mockResolvedValue(mockProject),
            update: jest.fn(),
          },
        },
        {
          provide: EmployeeRepository,
          useValue: {
            findById: jest.fn().mockResolvedValue(mockEmployee),
            findDefaultUser: jest.fn().mockResolvedValue(mockEmployee),
          },
        },
        {
          provide: MinioService,
          useValue: {
            moveFile: jest.fn(),
          },
        },
        {
          provide: 'STORAGE_CONFIG',
          useValue: {
            sourceBucket: 'source',
            destinationBucket: 'dest',
            destinationEntityFolder: 'folder',
          },
        },
      ],
    }).compile();

    handler = module.get<CreateCommentHandler>(CreateCommentHandler);
    commentRepository = module.get<CommentRepository>(CommentRepository);
    projectRepository = module.get<ProjectRepository>(ProjectRepository);
    employeeRepository = module.get<EmployeeRepository>(EmployeeRepository);
    minioService = module.get<MinioService>(MinioService);
  });

  it('should create a comment', async () => {
    const command = new CreateCommentCommand('507f1f77bcf86cd799439012', '507f1f77bcf86cd799439013', 'Test Comment');

    const result = await handler.execute(command);

    expect(result).toEqual(mockComment);
    expect(commentRepository.create).toHaveBeenCalled();
  });

  it('should throw NotFoundException if user not found', async () => {
    jest.spyOn(employeeRepository, 'findById').mockResolvedValue(null);

    const command = new CreateCommentCommand('507f1f77bcf86cd799439012', 'non-existent-user', 'Test Comment');

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if project not found', async () => {
    jest.spyOn(projectRepository, 'findById').mockResolvedValue(null);

    const command = new CreateCommentCommand('non-existent-project', '507f1f77bcf86cd799439013', 'Test Comment');

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });
});