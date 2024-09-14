import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';

import { ConfigModule, ConfigService } from '@nestjs/config';
import config from '@app/config/config';
import { SkillService } from './services/skill.service';
import { SkillRepository } from './repositories/skill.repository';
import { SkillCommandHandlers } from './commands';
import { Skill, SkillSchema } from './entities/skill.entity';
import { SkillController } from './controllers/skill.controller';
import { SkillQueryHandlers } from './queries';

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
    MongooseModule.forFeature([{ name: Skill.name, schema: SkillSchema }]),
    CqrsModule,
  ],
  providers: [SkillService, SkillRepository, ...SkillCommandHandlers, ...SkillQueryHandlers],
  controllers: [SkillController],
})
export class SkillModule {}
