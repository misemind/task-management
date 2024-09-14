import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { IssueTypeController } from './controllers/issue-type.controller';
import { IssueTypeService } from './services/issue-type.service';
import { IssueType, IssueTypeSchema } from './entities/issue-type.entity';
import { IssueTypeCommandHandlers } from './commands';
import { IssueTypeQueryHandlers } from './queries';
import { IssueTypeRepository } from './repositories/issue-type.repository';
import { FieldValue } from '../issue/entities/issue.entity';
import { FieldSchema } from '../field/entities/field.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: IssueType.name, schema: IssueTypeSchema },{ name: FieldValue.name, schema: FieldSchema }]),
    CqrsModule,
  ],
  providers: [IssueTypeService, IssueTypeRepository, ...IssueTypeCommandHandlers, ...IssueTypeQueryHandlers],
  controllers: [IssueTypeController],
  exports: [IssueTypeService, IssueTypeRepository],
})
export class IssueTypeModule {}