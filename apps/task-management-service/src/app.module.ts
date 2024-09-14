import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './domains/task/task.module';
import { MongooseModule } from '@nestjs/mongoose';
import config from '@app/config/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [TaskModule.forRoot(), 
    ConfigModule.forRoot({
    isGlobal: true,
    load: [config],
  }),
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      uri: configService.get<string>('database.url'),
    }),
  }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
