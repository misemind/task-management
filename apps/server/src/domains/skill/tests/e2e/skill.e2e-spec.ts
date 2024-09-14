import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';
import { CreateSkillDto } from '../../dto/create-skill.dto';

describe('SkillController (e2e)', () => {
  let app: INestApplication;
  let skillId: string;

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

  it('/api/skill (POST) - should create a new skill', async () => {
    const createSkillDto: CreateSkillDto = {
      name: 'JavaScript',
      category: 'Programming Language',
    };

    const response = await request(app.getHttpServer())
      .post('/api/skill')
      .send(createSkillDto)
      .expect(201);

    expect(response.body.name).toEqual('JavaScript');
    skillId = response.body._id;
  });

  it('/api/skill (GET) - should return all skills', async () => {
    return request(app.getHttpServer())
      .get('/api/skill')
      .query({ limit: 10, page: 1 })
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBeGreaterThan(0);
      });
  });
});