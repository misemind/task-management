// apps/server/src/domains/activity/activity.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { ActivityService } from './services/activity.service';
import { Activity, ActivitySchema } from './entities/activity.entity';
import { ActivityRepository } from './repositories/activity.repository';
import { ActivityCommandHandlers } from './commands';
import { ActivityQueryHandlers } from './queries';
import { ActivityController } from './controllers/activity.controller';
import { CoreModule } from '@app/core/core.module';
 // Assuming you want to include a controller

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Activity.name, schema: ActivitySchema }]),
    CqrsModule,
    CoreModule
  ],
  controllers: [ActivityController],
  providers: [ActivityService, ActivityRepository, ...ActivityCommandHandlers, ...ActivityQueryHandlers],
  exports: [ActivityService],
})
export class ActivityModule {}
