import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Readable } from 'stream';
import { CreateProjectDocumentCommand } from '@app/domains/project-document/commands/impl/create-project-document.command';
import { DeleteProjectDocumentCommand } from '@app/domains/project-document/commands/impl/delete-project-document.command';
import { DownloadProjectDocumentCommand } from '@app/domains/project-document/commands/impl/download-project-document.command';
import { UpdateProjectDocumentCommand } from '@app/domains/project-document/commands/impl/update-project-document.command';
import { CreateProjectDocumentDto } from '@app/domains/project-document/dto/create-project-document.dto';
import { UpdateProjectDocumentDto } from '@app/domains/project-document/dto/update-project-document.dto';
import { ProjectDocument } from '@app/domains/project-document/entities/project-document.entity';
import { GetProjectDocumentsQuery } from '@app/domains/project-document/queries/impl/get-project-documents.query';
import { GetTotalProjectDocumentsCountQuery } from '@app/domains/project-document/queries/impl/get-total-project-documents-count.query';
import { Logger } from '@app/core/common/logger/logger.service';

@Injectable()
export class ProjectDocumentService {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus,private logger:Logger) { }

  async createProjectDocument(createProjectDocumentDto: CreateProjectDocumentDto): Promise<ProjectDocument> {
    try {
      return await this.commandBus.execute(new CreateProjectDocumentCommand(createProjectDocumentDto));
    } catch (error) {
      console.log('ProjectDocumentService createProjectDocument', error);
      throw new InternalServerErrorException('Failed to create project document', error);
    }
  }

  async updateProjectDocument(id: string, updateProjectDocumentDto: UpdateProjectDocumentDto): Promise<ProjectDocument | null> {
    try {
      return await this.commandBus.execute(new UpdateProjectDocumentCommand(id, updateProjectDocumentDto));
    } catch (error) {
      console.log('ProjectDocumentService updateProjectDocument', error);
      throw new InternalServerErrorException('Failed to update project document', error);
    }
  }

  async deleteProjectDocument(id: string): Promise<ProjectDocument | null> {
    try {
      return await this.commandBus.execute(new DeleteProjectDocumentCommand(id));
    } catch (error) {
      console.log('ProjectDocumentService deleteProjectDocument', error);
      throw new InternalServerErrorException('Failed to delete project document', error);
    }
  }

  async getProjectDocuments(projectId: string, limit = 10, page = 1): Promise<{ total: number; documents: ProjectDocument[] }> {
    try {
      this.logger.log(`Retrieving documents for project ${projectId} with limit: ${limit}, page: ${page}`);
  
      const { data, total } = await this.queryBus.execute(new GetProjectDocumentsQuery(projectId, limit, page));
  
      this.logger.log(`Retrieved ${data.length} documents out of ${total} total`);
  
      return {
        total,
        documents: data,
      };
    } catch (error) {
      this.logger.error('Failed to retrieve project documents', error.stack);
      throw new InternalServerErrorException('Failed to retrieve project documents', error);
    }
  }
  async downloadProjectDocument(id: string): Promise<Readable> {
    return this.commandBus.execute(new DownloadProjectDocumentCommand(id));
  }
}