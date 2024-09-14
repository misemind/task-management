import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';
import { CreateIssueTypeDto } from '../../dto/create-issue-type.dto';

describe('IssueTypeController (e2e)', () => {
  let app: INestApplication;
  let issueTypeId: string;

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

  it('/api/issue-types (POST) - should create a new issue type', async () => {
    const createIssueTypeDto: CreateIssueTypeDto = {
      name: 'Test Issue Type',
      description: 'Test Description',
      sections: [],
    };

    const response = await request(app.getHttpServer())
      .post('/api/issue-types')
      .send(createIssueTypeDto)
      .expect(201);

    expect(response.body.name).toEqual('Test Issue Type');
    issueTypeId = response.body._id;
  });

  it('/api/issue-types/:id (GET) - should return an issue type by ID', () => {
    return request(app.getHttpServer())
      .get(`/api/issue-types/${issueTypeId}`)
      .expect(200)
      .then((response) => {
        expect(response.body._id).toEqual(issueTypeId);
      });
  });

  it('/api/issue-types/:id (PUT) - should update an issue type by ID', () => {
    const updateIssueTypeDto = { name: 'Updated Issue Type' };

    return request(app.getHttpServer())
      .put(`/api/issue-types/${issueTypeId}`)
      .send(updateIssueTypeDto)
      .expect(200)
      .then((response) => {
        expect(response.body.name).toEqual('Updated Issue Type');
      });
  });

  it('/api/issue-types/:id (DELETE) - should delete an issue type by ID', () => {
    return request(app.getHttpServer())
      .delete(`/api/issue-types/${issueTypeId}`)
      .expect(200)
      .then((response) => {
        expect(response.body._id).toEqual(issueTypeId);
      });
  });
});