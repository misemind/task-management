import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { Logger } from './core/common/logger/logger.service';
import * as path from 'path';
import * as express from 'express';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Kafka } from 'kafkajs';

async function createTopicsIfNotExist(kafka: Kafka) {
  const admin = kafka.admin();
  await admin.connect();

  const topicsToCreate = [
    { topic: 'batch.task.create', numPartitions: 1, replicationFactor: 1},
    // { topic: 'task.create', numPartitions: 1, replicationFactor: 1 },
    // { topic: 'task.update', numPartitions: 1, replicationFactor: 1},
    // { topic: 'task.delete', numPartitions: 1, replicationFactor: 1 },
    // { topic: 'task.getAll', numPartitions: 1, replicationFactor: 1 },
    // { topic: 'task.getById', numPartitions: 1, replicationFactor: 1 },
    // Add more topics as necessary
  ];

  try {
    const result = await admin.createTopics({
      waitForLeaders: true,
      topics: topicsToCreate.map((t) => ({
        topic: t.topic,
        numPartitions:t.numPartitions,
        replicationFactor:t.replicationFactor
      })),
    });

    if (result) {
      console.log('Topics created successfully');
    } else {
      console.log('Topics already exist or creation failed');
    }
  } catch (error) {
    console.error(`Error creating topics: ${error.message}`);
  } finally {
    await admin.disconnect();
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: '*',
    credentials: true,
  });

  const logger = app.get(Logger);
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 10000 }));
  app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Project Manager Service API')
    .setDescription('The project API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const kafka = new Kafka({
    clientId: 'nestjs-consumer-client',
    brokers: [configService.get<string>('kafka.brokerUrl')],
    ssl: true,
    sasl: {
      mechanism: 'plain',
      username: configService.get<string>('kafka.username'),
      password: configService.get<string>('kafka.password'),
    },
    connectionTimeout: 30000, // Set a higher timeout, e.g., 30 seconds
  });

  // Create topics dynamically
  //await createTopicsIfNotExist(kafka);

  const kafkaMicroservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [configService.get<string>('kafka.brokerUrl')],
        ssl: true,
        sasl: {
          mechanism: 'plain',
          username: configService.get<string>('kafka.username'),
          password: configService.get<string>('kafka.password'),
        },
      },
      consumer: {
        groupId: configService.get<string>('kafka.consumerGroupId'),
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(configService.get<string>('host.port'));
}

bootstrap();
