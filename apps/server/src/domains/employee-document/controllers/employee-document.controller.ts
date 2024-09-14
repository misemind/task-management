// apps/server/src/domains/employee/controllers/employee-document.controller.ts
import { Controller, Post, Put, Delete, Param, Get, Body, Res, NotFoundException, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EmployeeDocumentService } from '@app/domains/employee-document/services/employee-document.service';
import { CreateEmployeeDocumentDto } from '@app/domains/employee-document/dto/create-employee-document.dto';
import { UpdateEmployeeDocumentDto } from '@app/domains/employee-document/dto/update-employee-document.dto';
import { Response } from 'express';
import { DocumentService } from '@app/core/common/services/document.service';
import { PaginationDto } from '@app/domains/shared/dto/pagination.dto';

@ApiTags('Employee Documents')
@Controller('api/employees/:employeeId/documents')
export class EmployeeDocumentController {
  constructor(private readonly employeeDocumentService: EmployeeDocumentService, private documentService: DocumentService) { }

  @Post('upload')
  @ApiOperation({ summary: 'Upload a document for an employee' })
  @ApiResponse({ status: 201, description: 'The document has been successfully uploaded.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiParam({ name: 'employeeId', description: 'ID of the employee' })
  async uploadDocument(
    @Param('employeeId') employeeId: string,
    @Body() createEmployeeDocumentDto: CreateEmployeeDocumentDto
  ) {
    return this.employeeDocumentService.createEmployeeDocument({ ...createEmployeeDocumentDto, employeeId });
  }

  @Put(':documentId')
  @ApiOperation({ summary: 'Update a document for an employee' })
  @ApiResponse({ status: 200, description: 'The document has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Document not found.' })
  @ApiParam({ name: 'employeeId', description: 'ID of the employee' })
  @ApiParam({ name: 'documentId', description: 'ID of the document' })
  async updateDocument(
    @Param('employeeId') employeeId: string,
    @Param('documentId') documentId: string,
    @Body() updateEmployeeDocumentDto: UpdateEmployeeDocumentDto
  ) {
    return this.employeeDocumentService.updateEmployeeDocument(documentId, updateEmployeeDocumentDto);
  }

  @Delete(':documentId')
  @ApiOperation({ summary: 'Delete a document for an employee' })
  @ApiResponse({ status: 200, description: 'The document has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Document not found.' })
  @ApiParam({ name: 'employeeId', description: 'ID of the employee' })
  @ApiParam({ name: 'documentId', description: 'ID of the document' })
  async deleteDocument(
    @Param('employeeId') employeeId: string,
    @Param('documentId') documentId: string
  ) {
    return this.employeeDocumentService.deleteEmployeeDocument(documentId);
  }

  @Get(':documentId/download')
  @ApiOperation({ summary: 'Download a document for an employee' })
  @ApiResponse({ status: 200, description: 'Return the document stream.' })
  @ApiResponse({ status: 404, description: 'Document not found.' })
  @ApiParam({ name: 'employeeId', description: 'ID of the employee' })
  @ApiParam({ name: 'documentId', description: 'ID of the document' })
  async downloadDocument(
    @Param('documentId') documentId: string,
    @Res() res: Response
  ) {
    try {
      // Execute the command to get the document stream
      const documentStream = await this.employeeDocumentService.downloadEmployeeDocument(documentId);

      // If documentStream is not returned, throw a not found exception
      if (!documentStream) {
        throw new NotFoundException('Document not found');
      }

      // Set the appropriate headers
      res.setHeader('Content-Type', 'application/octet-stream'); // Generic content type, adjust as needed
      res.setHeader('Content-Disposition', `attachment; filename="${documentId}"`); // Adjust filename as needed

      // Pipe the document stream to the response
      documentStream.pipe(res);

      // Handle stream errors
      documentStream.on('error', (err) => {
        console.error('Stream error:', err);
        res.status(500).send('Error occurred while downloading the document');
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      res.status(500).send('Failed to download document');
    }
  }

  
  @Get()
  @ApiOperation({ summary: 'List all documents for an employee' })
  @ApiResponse({ status: 200, description: 'Return all employee documents.' })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  @ApiParam({ name: 'employeeId', description: 'ID of the employee' })
  async listDocuments(@Param('employeeId') employeeId: string, @Query() paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    return this.employeeDocumentService.getEmployeeDocuments(employeeId, limit, page);
  }
}
