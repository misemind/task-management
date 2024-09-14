import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';
import { CreateBoardDto } from '../../dto/create-board.dto';
import { UpdateBoardDto } from '../../dto/update-board.dto';

describe('BoardController (e2e)', () => {
  let app: INestApplication;
  let boardId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // You can import the actual AppModule which includes the BoardModule
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/boards (POST) - should create a new board', async () => {
    const createBoardDto: CreateBoardDto = {
      boardName: 'Test Board',
      projectId: '507f1f77bcf86cd799439012',
    };

    const response = await request(app.getHttpServer())
      .post('/api/boards')
      .send(createBoardDto)
      .expect(201);

    expect(response.body.boardName).toEqual('Test Board');
    expect(response.body.projectId).toEqual('507f1f77bcf86cd799439012');
    boardId = response.body._id; // Capture the created board ID for further tests
  });

  it('/api/boards/:id (GET) - should return a board by ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/boards/${boardId}`)
      .expect(200);

    expect(response.body._id).toEqual(boardId);
    expect(response.body.boardName).toEqual('Test Board');
  });

  it('/api/boards/:id (PUT) - should update a board by ID', async () => {
    const updateBoardDto: UpdateBoardDto = { boardName: 'Updated Board' };

    const response = await request(app.getHttpServer())
      .put(`/api/boards/${boardId}`)
      .send(updateBoardDto)
      .expect(200);

    expect(response.body.boardName).toEqual('Updated Board');
  });

  it('/api/boards/:id (DELETE) - should delete a board by ID', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/api/boards/${boardId}`)
      .expect(200);

    expect(response.body._id).toEqual(boardId);
  });

  it('/api/boards/:id (GET) - should return 404 after deletion', async () => {
    await request(app.getHttpServer())
      .get(`/api/boards/${boardId}`)
      .expect(404);
  });
});