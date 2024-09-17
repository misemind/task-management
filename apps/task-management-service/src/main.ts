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

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: '*', // replace with your frontend URL or keep it as '*' to allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // or use '*' to allow all methods
    allowedHeaders: '*', // allows all headers
    credentials: true, // enable credentials (cookies, Authorization headers, etc.)
  });

  const logger = app.get(Logger);
  // app.useLogger(logger);

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 10000 }));
  app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

  // Add Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Automatically remove non-whitelisted properties
      forbidNonWhitelisted: false, // Throw an error if non-whitelisted properties are provided
      transform: true, // Automatically transform payloads to be instances of their DTO classes
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

  const brokerUrl = configService.get<string>('kafka.brokerUrl');
  const username = configService.get<string>('kafka.username');
  const password = configService.get<string>('kafka.password');
  const consumerGroupId = configService.get<string>('kafka.consumerGroupId');
  
  // Console log the values to debug

  
  const kafkaMicroservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [brokerUrl],
        ssl: true,
        sasl: {
          mechanism: 'plain',
          username: username,
          password: password,
        },
      },
      consumer: {
        groupId: consumerGroupId,
      },
    },
  });
  
  


  // Start the microservices
  await app.startAllMicroservices(); 
  await app.listen(configService.get<string>('host.port'));

}
bootstrap();
