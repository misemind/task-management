import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { EmployeeExperienceController } from './controllers/employee-experience.controller';
import { EmployeeExperienceService } from './services/employee-experience.service';
import { EmployeeExperience, EmployeeExperienceSchema } from './entities/employee-experience.entity';
import { EmployeeExperienceRepository } from './repositories/employee-experience.repository';
import { EmployeeExperienceCommandsHandler } from './commands';
import { EmployeeExperienceQueriesHandler } from './queries';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: EmployeeExperience.name, schema: EmployeeExperienceSchema }]),
    CqrsModule,
  ],
  providers: [
    EmployeeExperienceService,
    EmployeeExperienceRepository,
    ...EmployeeExperienceCommandsHandler,
    ...EmployeeExperienceQueriesHandler
  ],
  controllers: [EmployeeExperienceController],
})
export class EmployeeExperienceModule {}
