import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateIssueDto } from '@app/domains/issue/dto/create-issue.dto';
import { UpdateIssueDto } from '@app/domains/issue/dto/update-issue.dto';
import { IssueService } from '@app/domains/issue/services/issue.service';
import { PaginationDto } from '@app/domains/shared/dto/pagination.dto';

@ApiTags('Issue')
@Controller('api/issues')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new issue' })
  @ApiResponse({ status: 201, description: 'The issue has been successfully created.' })
  create(@Body() createIssueDto: CreateIssueDto) {
    return this.issueService.createIssue(createIssueDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an issue by ID' })
  @ApiResponse({ status: 200, description: 'Return the issue.' })
  @ApiResponse({ status: 404, description: 'Issue not found.' })
  findOne(@Param('id') id: string) {
    return this.issueService.getIssueById(id);
  }

  @Get('/project/:projectId')
  @ApiOperation({ summary: 'Get issues by project ID with pagination' })
  @ApiResponse({ status: 200, description: 'Return the issues for a project.' })
  @ApiResponse({ status: 404, description: 'Issues not found for the project ID.' })
  findByProjectId(
    @Param('projectId') projectId: string,
    @Query() paginationDto: PaginationDto
  ) {
    return this.issueService.getIssuesByProjectId(projectId, paginationDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an issue by ID' })
  @ApiResponse({ status: 200, description: 'The issue has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateIssueDto: UpdateIssueDto) {
    return this.issueService.updateIssue(id, updateIssueDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an issue by ID' })
  @ApiResponse({ status: 200, description: 'The issue has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.issueService.deleteIssue(id);
  }
}