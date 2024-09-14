import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';
import { CreateFieldDto } from '../../dto/create-field.dto';
import { UpdateFieldDto } from '../../dto/update-field.dto';

describe('FieldController (e2e)', () => {
  let app: INestApplication;
  let fieldId: string;

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

  it('/api/fields (POST) - should create a new field', async () => {
    const createFieldDto: CreateFieldDto = {
      name: 'Test Field',
      type: 'text',
      description: 'Test Field Description',
      required: true,
      fieldType: 'default',
      options: [],
    };

    const response = await request(app.getHttpServer())
      .post('/api/fields')
      .send(createFieldDto)
      .expect(201);

    expect(response.body.name).toEqual('Test Field');
    fieldId = response.body._id;
  });

  it('/api/fields/:id (GET) - should return a field by ID', () => {
    return request(app.getHttpServer())
      .get(`/api/fields/${fieldId}`)
      .expect(200)
      .then((response) => {
        expect(response.body._id).toEqual(fieldId);
      });
  });

  it('/api/fields/:id (PUT) - should update a field by ID', () => {
    const updateFieldDto: UpdateFieldDto = { name: 'Updated Field' };

    return request(app.getHttpServer())
      .put(`/api/fields/${fieldId}`)
      .send(updateFieldDto)
      .expect(200)
      .then((response) => {
        expect(response.body.name).toEqual('Updated Field');
      });
  });

  it('/api/fields/:id (DELETE) - should delete a field by ID', () => {
    return request(app.getHttpServer())
      .delete(`/api/fields/${fieldId}`)
      .expect(200)
      .then((response) => {
        expect(response.body._id).toEqual(fieldId);
      });
  });
});