import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';
import { CreateBaseEntityDto } from '../../dto/create-base-entity.dto';
import { UpdateBaseEntityDto } from '../../dto/update-base-entity.dto';

describe('BaseEntityController (e2e)', () => {
  let app: INestApplication;
  let baseEntityId: string;

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

  it('/api/base-entities (POST) - should create a new base entity', async () => {
    const createBaseEntityDto: CreateBaseEntityDto = {
      entityType: 'TestEntity',
      entityId: '507f1f77bcf86cd799439012',
      name: 'Test Name',
    };

    const response = await request(app.getHttpServer())
      .post('/api/base-entities')
      .send(createBaseEntityDto)
      .expect(201);

    expect(response.body.entityType).toEqual('TestEntity');
    baseEntityId = response.body._id;
  });

  it('/api/base-entities/:id (GET) - should return a base entity by ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/base-entities/${baseEntityId}`)
      .expect(200);

    expect(response.body._id).toEqual(baseEntityId);
  });

  it('/api/base-entities/:id (PUT) - should update a base entity by ID', async () => {
    const updateBaseEntityDto: UpdateBaseEntityDto = { name: 'Updated Name' };

    const response = await request(app.getHttpServer())
      .put(`/api/base-entities/${baseEntityId}`)
      .send(updateBaseEntityDto)
      .expect(200);

    expect(response.body.name).toEqual('Updated Name');
  });

  it('/api/base-entities/:id (DELETE) - should delete a base entity by ID', async () => {
    await request(app.getHttpServer())
      .delete(`/api/base-entities/${baseEntityId}`)
      .expect(200);
  });
});