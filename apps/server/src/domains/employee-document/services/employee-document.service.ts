import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateEmployeeDocumentCommand } from '@app/domains/employee-document/commands/impl/create-employee-document.command';
import { UpdateEmployeeDocumentCommand } from '@app/domains/employee-document/commands/impl/update-employee-document.command';
import { DeleteEmployeeDocumentCommand } from '@app/domains/employee-document/commands/impl/delete-employee-document.command';
import { GetEmployeeDocumentsQuery } from '@app/domains/employee-document/queries/impl/get-employee-documents.query';
import { CreateEmployeeDocumentDto } from '@app/domains/employee-document/dto/create-employee-document.dto';
import { UpdateEmployeeDocumentDto } from '@app/domains/employee-document/dto/update-employee-document.dto';
import { EmployeeDocument } from '@app/domains/employee-document/entities/employee-document.entity';
import { DownloadEmployeeDocumentCommand } from '@app/domains/employee-document/commands/impl/download-employee-document.command';
import { Logger } from '@app/core/common/logger/logger.service';
import { Readable } from 'stream';
import { GetTotalEmployeeDocumentsCountQuery } from '@app/domains/employee-document/queries/impl/get-total-employee-documents-count.query';


@Injectable()
export class EmployeeDocumentService {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus,private logger:Logger) { }

  async createEmployeeDocument(createEmployeeDocumentDto: CreateEmployeeDocumentDto): Promise<EmployeeDocument> {
    try {
      return await this.commandBus.execute(new CreateEmployeeDocumentCommand(createEmployeeDocumentDto));
    } catch (error) {
      console.log('EmployeeDocumentService createEmployeeDocument', error);
      throw new InternalServerErrorException('Failed to create employee document', error);
    }
  }

  async updateEmployeeDocument(id: string, updateEmployeeDocumentDto: UpdateEmployeeDocumentDto): Promise<EmployeeDocument | null> {
    try {
      return await this.commandBus.execute(new UpdateEmployeeDocumentCommand(id, updateEmployeeDocumentDto));
    } catch (error) {
      console.log('EmployeeDocumentService updateEmployeeDocument', error);
      throw new InternalServerErrorException('Failed to update employee document', error);
    }
  }

  async deleteEmployeeDocument(id: string): Promise<EmployeeDocument | null> {
    try {
      return await this.commandBus.execute(new DeleteEmployeeDocumentCommand(id));
    } catch (error) {
      console.log('EmployeeDocumentService deleteEmployeeDocument', error);
      throw new InternalServerErrorException('Failed to delete employee document', error);
    }
  }
  async getEmployeeDocuments(employeeId: string, limit = 10, page = 1): Promise<{ total: number; documents: EmployeeDocument[] }> {
    try {
      this.logger.log(`Retrieving documents for employee ${employeeId} with limit: ${limit}, page: ${page}`);

      const { data, total } = await this.queryBus.execute(new GetEmployeeDocumentsQuery(employeeId, limit, page));

      this.logger.log(`Retrieved ${data.length} documents out of ${total} total`);

      return {
        total,
        documents: data,
      };
    } catch (error) {
      this.logger.error('Failed to retrieve employee documents', error.stack);
      throw new InternalServerErrorException('Failed to retrieve employee documents', error);
    }
  }

  
  async downloadEmployeeDocument(id: string): Promise<Readable> {
    return this.commandBus.execute(new DownloadEmployeeDocumentCommand(id));
  }
  
}