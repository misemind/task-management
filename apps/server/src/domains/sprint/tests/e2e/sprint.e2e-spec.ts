import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';
import { CreateSprintDto } from '../../dto/create-sprint.dto';

describe('SprintController (e2e)', () => {
  let app: INestApplication;
  let sprintId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/sprints (POST) - should create a new sprint', async () => {
    const createSprintDto: CreateSprintDto = {
      sprintName: 'Sprint 1',
      boardId: '507f1f77bcf86cd799439012',
      projectId: '507f1f77bcf86cd799439013',
      duration: '2 weeks',
      startDatetime: '2023-09-01T00:00:00.000Z',
      endDatetime: '2023-09-14T23:59:59.999Z',
      active: true,
      sprintGoal: 'Complete all high-priority tasks',
    };

    const response = await request(app.getHttpServer())
      .post('/api/sprints')
      .send(createSprintDto)
      .expect(201);

    expect(response.body.sprintName).toEqual('Sprint 1');
    sprintId = response.body._id;
  });

  it('/api/sprints/:id (GET) - should return a sprint by ID', () => {
    return request(app.getHttpServer())
      .get(`/api/sprints/${sprintId}`)
      .expect(200)
      .then((response) => {
        expect(response.body._id).toEqual(sprintId);
      });
  });

  it('/api/sprints/:id (PUT) - should update a sprint by ID', () => {
    const updateSprintDto = { sprintName: 'Updated Sprint' };

    return request(app.getHttpServer())
      .put(`/api/sprints/${sprintId}`)
      .send(updateSprintDto)
      .expect(200)
      .then((response) => {
        expect(response.body.sprintName).toEqual('Updated Sprint');
      });
  });

  it('/api/sprints/:id (DELETE) - should delete a sprint by ID', () => {
    return request(app.getHttpServer())
      .delete(`/api/sprints/${sprintId}`)
      .expect(200)
      .then((response) => {
        expect(response.body._id).toEqual(sprintId);
      });
  });
});