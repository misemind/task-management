import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AllDomains } from './domains';
import { MinioModule } from './infrastructure/cloud/minio/minio.module';
import { CoreModule } from './core/core.module';
import { MongooseModule } from '@nestjs/mongoose';
import config from '@app/config/config';

@Module({
  imports: [
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
    }),
    MinioModule,
    CoreModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }), ...AllDomains],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
