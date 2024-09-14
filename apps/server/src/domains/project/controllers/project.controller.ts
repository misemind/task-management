import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateProjectDto } from '@app/domains/project/dto/create-project.dto';
import { UpdateProjectDto } from '@app/domains/project/dto/update-project.dto';
import { PaginationDto } from '@app/domains/shared/dto/pagination.dto';
import { ProjectService } from '@app/domains/project/services/project.service';
import { RequestProjectDto } from '@app/domains/project/dto/request-project.dto';

@ApiTags('Project')
@Controller('api/projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'The project has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() requestProjectDto: RequestProjectDto) {
    return this.projectService.createProject(requestProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'Return all projects.' })
  findAll(@Query() paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    return this.projectService.getAllProjects(limit, page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiResponse({ status: 200, description: 'Return the project.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  findOne(@Param('id') id: string) {
    return this.projectService.getProjectById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a project by ID' })
  @ApiResponse({ status: 200, description: 'The project has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  update(@Param('id') id: string, @Body() requestProjectDto: RequestProjectDto) {
    return this.projectService.updateProject(id, requestProjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project by ID' })
  @ApiResponse({ status: 200, description: 'The project has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  remove(@Param('id') id: string) {
    return this.projectService.deleteProject(id);
  }
}
