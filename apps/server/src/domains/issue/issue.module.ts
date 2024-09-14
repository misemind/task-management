import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { IssueController } from './controllers/issue.controller';
import { IssueService } from './services/issue.service';
import { Issue, IssueSchema } from './entities/issue.entity';
import { IssueCommandHandlers } from './commands';
import { IssueQueryHandlers } from './queries';
import { IssueRepository } from './repositories/issue.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Issue.name, schema: IssueSchema }]),
    CqrsModule,
  ],
  providers: [IssueService, IssueRepository, ...IssueCommandHandlers, ...IssueQueryHandlers],
  controllers: [IssueController],
  exports: [IssueService, IssueRepository],
})
export class IssueModule {}