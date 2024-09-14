import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';
import { CreateActivityDto } from '../../dto/create-activity.dto';

describe('ActivityController (e2e)', () => {
  let app: INestApplication;
  let activityId: string;

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

  it('/api/activities (POST) - should create a new activity', async () => {
    const createActivityDto: CreateActivityDto = {
      activityTitle: 'New Task',
      project_id: '507f1f77bcf86cd799439012',
      activityType: 'Task',
      status: 'New',
      priority: 'High',
    };

    const response = await request(app.getHttpServer())
      .post('/api/activities')
      .send(createActivityDto)
      .expect(201);

    expect(response.body.activityTitle).toEqual('New Task');
    activityId = response.body._id;
  });

  it('/api/activities/:id (GET) - should return an activity by ID', () => {
    return request(app.getHttpServer())
      .get(`/api/activities/${activityId}`)
      .expect(200)
      .then((response) => {
        expect(response.body._id).toEqual(activityId);
      });
  });

  it('/api/activities/:id (PUT) - should update an activity by ID', () => {
    const updateActivityDto = { activityTitle: 'Updated Task' };

    return request(app.getHttpServer())
      .put(`/api/activities/${activityId}`)
      .send(updateActivityDto)
      .expect(200)
      .then((response) => {
        expect(response.body.activityTitle).toEqual('Updated Task');
      });
  });

  it('/api/activities/:id (DELETE) - should delete an activity by ID', () => {
    return request(app.getHttpServer())
      .delete(`/api/activities/${activityId}`)
      .expect(200)
      .then((response) => {
        expect(response.body._id).toEqual(activityId);
      });
  });
});