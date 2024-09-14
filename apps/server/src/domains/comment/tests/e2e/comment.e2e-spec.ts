import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { CommentController } from '@app/domains/comment/controllers/comment.controller';
import { CommentService } from '@app/domains/comment/services/comment.service';
import { CreateCommentDto } from '@app/domains/comment/dto/create-comment.dto';
import { UpdateCommentDto } from '@app/domains/comment/dto/update-comment.dto';

describe('CommentController (e2e)', () => {
  let app: INestApplication;
  let commentService = {
    createComment: jest.fn(),
    updateComment: jest.fn(),
    deleteComment: jest.fn(),
    getCommentsByProjectId: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        {
          provide: CommentService,
          useValue: commentService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/projects/:projectId/comments (POST) - should create a new comment', async () => {
    const projectId = '507f1f77bcf86cd799439011';
    const createCommentDto: CreateCommentDto = { content: 'Test Comment' };
    commentService.createComment.mockResolvedValue({
      id: '1',
      content: 'Test Comment',
      projectId: projectId,
    });

    const response = await request(app.getHttpServer())
      .post(`/api/projects/${projectId}/comments`)
      .send(createCommentDto)
      .expect(201);

    expect(response.body.content).toEqual('Test Comment');
    expect(response.body.projectId).toEqual(projectId);
  });

  it('/api/projects/:projectId/comments (GET) - should retrieve comments by project ID', async () => {
    const projectId = '507f1f77bcf86cd799439011';
    commentService.getCommentsByProjectId.mockResolvedValue([
      { id: '1', content: 'Test Comment', projectId },
    ]);

    const response = await request(app.getHttpServer())
      .get(`/api/projects/${projectId}/comments`)
      .expect(200);

    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].projectId).toEqual(projectId);
  });

  it('/api/projects/:projectId/comments/:id (PUT) - should update a comment', async () => {
    const projectId = '507f1f77bcf86cd799439011';
    const commentId = '1';
    const updateCommentDto: UpdateCommentDto = { content: 'Updated Comment Content' };

    commentService.updateComment.mockResolvedValue({
      id: commentId,
      content: 'Updated Comment Content',
      projectId,
    });

    const response = await request(app.getHttpServer())
      .put(`/api/projects/${projectId}/comments/${commentId}`)
      .send(updateCommentDto)
      .expect(200);

    expect(response.body.content).toEqual('Updated Comment Content');
  });

  it('/api/projects/:projectId/comments/:id (DELETE) - should delete a comment', async () => {
    const projectId = '507f1f77bcf86cd799439011';
    const commentId = '1';

    commentService.deleteComment.mockResolvedValue({});

    await request(app.getHttpServer())
      .delete(`/api/projects/${projectId}/comments/${commentId}`)
      .expect(200);
  });
});
