import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ProjectModule } from '../../project.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MinioService } from '../../../../infrastructure/cloud/minio/minio.service';
import { WinstonConfigService } from '@app/core/common/logger/winston-config.service';

describe('ProjectController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/nest_test_db'), // Connect to test database
        ProjectModule.forRoot({
          sourceBucket: 'source',
          destinationBucket: 'destination',
          destinationEntityFolder: 'projects',
        }),
      ],
    })
    .overrideProvider(MinioService)
    .useValue(MinioService) // Inject mocked MinioService
    .overrideProvider(WinstonConfigService)
    .useValue(WinstonConfigService) // Inject mocked WinstonConfigService
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Project API (e2e)', () => {
    let projectId: string;

    it('/api/projects (POST) - should create a project', async () => {
      const createProjectDto = {
        title: 'New E2E Project',
        description: 'Testing the creation of a project via E2E test',
        endDate: '2024-12-31',
        priority: 'high',
        status: 'pending',
      };

      const response = await request(app.getHttpServer())
        .post('/api/projects')
        .send(createProjectDto)
        .expect(201);

      expect(response.body.title).toBe('New E2E Project');
      expect(response.body.status).toBe('pending');
      projectId = response.body._id; // Store the project ID for further tests
    });

    it('/api/projects/:id (GET) - should retrieve the created project by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/projects/${projectId}`)
        .expect(200);

      expect(response.body._id).toBe(projectId);
      expect(response.body.title).toBe('New E2E Project');
    });

    it('/api/projects/:id (PUT) - should update the project by ID', async () => {
      const updateProjectDto = {
        title: 'Updated E2E Project',
        description: 'Updated description for E2E test project',
        status: 'inprogress',
      };

      const response = await request(app.getHttpServer())
        .put(`/api/projects/${projectId}`)
        .send(updateProjectDto)
        .expect(200);

      expect(response.body._id).toBe(projectId);
      expect(response.body.title).toBe('Updated E2E Project');
      expect(response.body.status).toBe('inprogress');
    });

    it('/api/projects (GET) - should return a list of projects with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/projects')
        .query({ limit: 10, page: 1 }) // Pagination query params
        .expect(200);

      expect(Array.isArray(response.body.projects)).toBe(true);
      expect(response.body.projects.length).toBeGreaterThan(0);
    });

    it('/api/projects/:id (DELETE) - should delete the project by ID', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/projects/${projectId}`)
        .expect(200);

      expect(response.body._id).toBe(projectId);
    });

    it('/api/projects/:id (GET) - should return 404 after project deletion', async () => {
      await request(app.getHttpServer())
        .get(`/api/projects/${projectId}`)
        .expect(404);
    });
  });
});
