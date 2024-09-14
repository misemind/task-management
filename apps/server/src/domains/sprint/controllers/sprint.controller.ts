import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateSprintDto } from '@app/domains/sprint/dto/create-sprint.dto';
import { UpdateSprintDto } from '@app/domains/sprint/dto/update-sprint.dto';
import { SprintService } from '@app/domains/sprint/services/sprint.service';
import { PaginationDto } from '@app/domains/shared/dto/pagination.dto';

@ApiTags('Sprint')
@Controller('api/sprints')
export class SprintController {
  constructor(private readonly sprintService: SprintService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sprint' })
  @ApiResponse({ status: 201, description: 'The sprint has been successfully created.' })
  create(@Body() createSprintDto: CreateSprintDto) {
    return this.sprintService.createSprint(createSprintDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a sprint by ID' })
  @ApiResponse({ status: 200, description: 'Return the sprint.' })
  @ApiResponse({ status: 404, description: 'Sprint not found.' })
  findOne(@Param('id') id: string) {
    return this.sprintService.getSprintById(id);
  }

  @Get('/project/:projectId')
  @ApiOperation({ summary: 'Get sprints by project ID with pagination' })
  @ApiResponse({ status: 200, description: 'Return the sprints for a project.' })
  @ApiResponse({ status: 404, description: 'Sprints not found for the project ID.' })
  findByProjectId(
    @Param('projectId') projectId: string,
    @Query() paginationDto: PaginationDto
  ) {
    return this.sprintService.getSprintsByProjectId(projectId, paginationDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a sprint by ID' })
  @ApiResponse({ status: 200, description: 'The sprint has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateSprintDto: UpdateSprintDto) {
    return this.sprintService.updateSprint(id, updateSprintDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a sprint by ID' })
  @ApiResponse({ status: 200, description: 'The sprint has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.sprintService.deleteSprint(id);
  }
}