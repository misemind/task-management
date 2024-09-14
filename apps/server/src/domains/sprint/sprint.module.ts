// ../apps/server/src/domains/sprint/sprint.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { SprintController } from './controllers/sprint.controller';
import { SprintService } from './services/sprint.service';
import { Sprint, SprintSchema } from './entities/sprint.entity';
import { SprintCommandHandlers } from './commands';
import { SprintQueryHandlers } from './queries';
import { SprintRepository } from './repositories/sprint.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sprint.name, schema: SprintSchema }]),
    CqrsModule,
  ],
  providers: [SprintService, SprintRepository, ...SprintCommandHandlers, ...SprintQueryHandlers],
  controllers: [SprintController],
  exports: [SprintService, SprintRepository],
})
export class SprintModule {}
