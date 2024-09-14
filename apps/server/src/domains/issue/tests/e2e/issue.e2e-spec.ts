import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';
import { CreateIssueDto } from '../../dto/create-issue.dto';

describe('IssueController (e2e)', () => {
  let app: INestApplication;
  let issueId: string;

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

  it('/api/issues (POST) - should create a new issue', async () => {
    const createIssueDto: CreateIssueDto = {
      summary: 'Test Issue',
      description: 'Test Issue Description',
      projectId: '507f1f77bcf86cd799439012',
      issueTypeId: '507f1f77bcf86cd799439013',
      fieldValues: [],
    };

    const response = await request(app.getHttpServer())
      .post('/api/issues')
      .send(createIssueDto)
      .expect(201);

    expect(response.body.summary).toEqual('Test Issue');
    issueId = response.body._id;
  });

  it('/api/issues/:id (GET) - should return an issue by ID', () => {
    return request(app.getHttpServer())
      .get(`/api/issues/${issueId}`)
      .expect(200)
      .then((response) => {
        expect(response.body._id).toEqual(issueId);
      });
  });

  it('/api/issues/:id (PUT) - should update an issue by ID', () => {
    const updateIssueDto = { summary: 'Updated Issue' };

    return request(app.getHttpServer())
      .put(`/api/issues/${issueId}`)
      .send(updateIssueDto)
      .expect(200)
      .then((response) => {
        expect(response.body.summary).toEqual('Updated Issue');
      });
  });

  it('/api/issues/:id (DELETE) - should delete an issue by ID', () => {
    return request(app.getHttpServer())
      .delete(`/api/issues/${issueId}`)
      .expect(200)
      .then((response) => {
        expect(response.body._id).toEqual(issueId);
      });
  });
});