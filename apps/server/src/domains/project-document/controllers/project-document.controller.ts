import { Controller, Post, Put, Delete, Param, Get, Body, Res, NotFoundException, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProjectDocumentService } from '@app/domains/project-document/services/project-document.service';
import { CreateProjectDocumentDto } from '@app/domains/project-document/dto/create-project-document.dto';
import { UpdateProjectDocumentDto } from '@app/domains/project-document/dto/update-project-document.dto';
import { Response } from 'express';
import { DocumentService } from '@app/core/common/services/document.service';
import { PaginationDto } from '@app/domains/shared/dto/pagination.dto';


@ApiTags('Project Documents')
@Controller('api/projects/:projectId/documents')
export class ProjectDocumentController {
  constructor(private readonly projectDocumentService: ProjectDocumentService, private documentService: DocumentService) { }

  @Post('upload')
  @ApiOperation({ summary: 'Upload a document for a project' })
  @ApiResponse({ status: 201, description: 'The document has been successfully uploaded.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  async uploadDocument(
    @Param('projectId') projectId: string,
    @Body() createProjectDocumentDto: CreateProjectDocumentDto
  ) {
    return this.projectDocumentService.createProjectDocument({ ...createProjectDocumentDto, projectId });
  }

  @Put(':documentId')
  @ApiOperation({ summary: 'Update a document for a project' })
  @ApiResponse({ status: 200, description: 'The document has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Document not found.' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiParam({ name: 'documentId', description: 'ID of the document' })
  async updateDocument(
    @Param('projectId') projectId: string,
    @Param('documentId') documentId: string,
    @Body() updateProjectDocumentDto: UpdateProjectDocumentDto
  ) {
    return this.projectDocumentService.updateProjectDocument(documentId, updateProjectDocumentDto);
  }

  @Delete(':documentId')
  @ApiOperation({ summary: 'Delete a document for a project' })
  @ApiResponse({ status: 200, description: 'The document has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Document not found.' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiParam({ name: 'documentId', description: 'ID of the document' })
  async deleteDocument(
    @Param('projectId') projectId: string,
    @Param('documentId') documentId: string
  ) {
    return this.projectDocumentService.deleteProjectDocument(documentId);
  }

  @Get(':documentId/download')
  @ApiOperation({ summary: 'Download a document for a project' })
  @ApiResponse({ status: 200, description: 'Return the document stream.' })
  @ApiResponse({ status: 404, description: 'Document not found.' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  @ApiParam({ name: 'documentId', description: 'ID of the document' })
  async downloadDocument(
    @Param('documentId') documentId: string,
    @Res() res: Response
  ) {
    try {
      // Execute the command to get the document stream
      const documentStream = await this.projectDocumentService.downloadProjectDocument(documentId);

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
  @ApiOperation({ summary: 'List all documents for a project' })
  @ApiResponse({ status: 200, description: 'Return all project documents.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  async listDocuments(@Param('projectId') projectId: string, @Query() paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    return this.projectDocumentService.getProjectDocuments(projectId, limit, page);
  }
}