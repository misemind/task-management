import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateIssueTypeDto } from '@app/domains/issue-type/dto/create-issue-type.dto';
import { UpdateIssueTypeDto } from '@app/domains/issue-type/dto/update-issue-type.dto';
import { IssueTypeService } from '@app/domains/issue-type/services/issue-type.service';

@ApiTags('IssueType')
@Controller('api/issue-types')
export class IssueTypeController {
  constructor(private readonly issueTypeService: IssueTypeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new issue type' })
  @ApiResponse({ status: 201, description: 'The issue type has been successfully created.' })
  create(@Body() createIssueTypeDto: CreateIssueTypeDto) {
    return this.issueTypeService.createIssueType(createIssueTypeDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an issue type by ID' })
  @ApiResponse({ status: 200, description: 'Return the issue type.' })
  @ApiResponse({ status: 404, description: 'Issue type not found.' })
  findOne(@Param('id') id: string) {
    return this.issueTypeService.getIssueTypeById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an issue type by ID' })
  @ApiResponse({ status: 200, description: 'The issue type has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateIssueTypeDto: UpdateIssueTypeDto) {
    return this.issueTypeService.updateIssueType(id, updateIssueTypeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an issue type by ID' })
  @ApiResponse({ status: 200, description: 'The issue type has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.issueTypeService.deleteIssueType(id);
  }
}